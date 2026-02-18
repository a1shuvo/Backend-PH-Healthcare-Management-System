import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaStringFilter,
  PrismaWhereConditions,
} from "../interfaces/query.interface";

// T = Model Type
export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private selectFields: Record<string, boolean | undefined>;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };

    this.countQuery = {
      where: {},
    };
  }

  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;

    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map(
        (filed) => {
          if (filed.includes(".")) {
            const parts = filed.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;

              const stringFilter: PrismaStringFilter = {
                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [relation]: {
                  [nestedField]: stringFilter,
                },
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;

              const stringFilter: PrismaStringFilter = {
                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [relation]: {
                  [nestedRelation]: {
                    [nestedField]: stringFilter,
                  },
                },
              };
            }
          }

          // Direct field
          const stringFilter: PrismaStringFilter = {
            contains: searchTerm,
            mode: "insensitive" as const,
          };

          return {
            [filed]: stringFilter,
          };
        },
      );

      const whereConditions = this.query.where as PrismaWhereConditions;
      whereConditions.OR = searchConditions;

      const countWhereConditions = this.countQuery
        .where as PrismaWhereConditions;
      countWhereConditions.OR = searchConditions;
    }

    return this;
  }
}
