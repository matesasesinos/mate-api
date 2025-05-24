import { Repository, ObjectLiteral, FindOptionsRelations } from 'typeorm';
import { PaginationDto, OrderDirection } from '../common/dto/pagination.dto';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  next: string | false;
  previous: string | false;
}

export interface PaginationOptions {
  baseUrl: string;
  orderBy?: string;
  defaultOrder?: OrderDirection;
  relations?: FindOptionsRelations<any>;
}

export class PaginationHelper {
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<T>> {
    const { 
      page = 1, 
      per_page = 10, 
      order = options.defaultOrder || OrderDirection.DESC 
    } = paginationDto;
    
    const skip = (page - 1) * per_page;

    const [items, total] = await repository.findAndCount({
      skip,
      take: per_page,
      order: {
        [options.orderBy || 'created_at']: order,
      } as any,
      relations: options.relations,
    });

    const total_pages = Math.ceil(total / per_page);

    // Build base URL with existing query parameters
    const queryParams = new URLSearchParams();
    if (per_page !== 10) queryParams.set('per_page', per_page.toString());
    if (order !== (options.defaultOrder || OrderDirection.DESC)) {
      queryParams.set('order', order);
    }

    // Build next and previous URLs
    const next = page < total_pages 
      ? `${options.baseUrl}?${queryParams.toString()}&page=${page + 1}`
      : false;
    
    const previous = page > 1 
      ? `${options.baseUrl}?${queryParams.toString()}&page=${page - 1}`
      : false;

    return {
      items,
      total,
      page,
      per_page,
      total_pages,
      next,
      previous,
    };
  }
} 