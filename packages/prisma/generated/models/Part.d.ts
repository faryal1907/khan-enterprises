import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type PartModel = runtime.Types.Result.DefaultSelection<Prisma.$PartPayload>;
export type AggregatePart = {
    _count: PartCountAggregateOutputType | null;
    _avg: PartAvgAggregateOutputType | null;
    _sum: PartSumAggregateOutputType | null;
    _min: PartMinAggregateOutputType | null;
    _max: PartMaxAggregateOutputType | null;
};
export type PartAvgAggregateOutputType = {
    sellingPrice: runtime.Decimal | null;
};
export type PartSumAggregateOutputType = {
    sellingPrice: runtime.Decimal | null;
};
export type PartMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    sku: string | null;
    category: string | null;
    description: string | null;
    sellingPrice: runtime.Decimal | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PartMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    sku: string | null;
    category: string | null;
    description: string | null;
    sellingPrice: runtime.Decimal | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PartCountAggregateOutputType = {
    id: number;
    name: number;
    sku: number;
    category: number;
    description: number;
    sellingPrice: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PartAvgAggregateInputType = {
    sellingPrice?: true;
};
export type PartSumAggregateInputType = {
    sellingPrice?: true;
};
export type PartMinAggregateInputType = {
    id?: true;
    name?: true;
    sku?: true;
    category?: true;
    description?: true;
    sellingPrice?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PartMaxAggregateInputType = {
    id?: true;
    name?: true;
    sku?: true;
    category?: true;
    description?: true;
    sellingPrice?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PartCountAggregateInputType = {
    id?: true;
    name?: true;
    sku?: true;
    category?: true;
    description?: true;
    sellingPrice?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PartAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartWhereInput;
    orderBy?: Prisma.PartOrderByWithRelationInput | Prisma.PartOrderByWithRelationInput[];
    cursor?: Prisma.PartWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PartCountAggregateInputType;
    _avg?: PartAvgAggregateInputType;
    _sum?: PartSumAggregateInputType;
    _min?: PartMinAggregateInputType;
    _max?: PartMaxAggregateInputType;
};
export type GetPartAggregateType<T extends PartAggregateArgs> = {
    [P in keyof T & keyof AggregatePart]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePart[P]> : Prisma.GetScalarType<T[P], AggregatePart[P]>;
};
export type PartGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartWhereInput;
    orderBy?: Prisma.PartOrderByWithAggregationInput | Prisma.PartOrderByWithAggregationInput[];
    by: Prisma.PartScalarFieldEnum[] | Prisma.PartScalarFieldEnum;
    having?: Prisma.PartScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PartCountAggregateInputType | true;
    _avg?: PartAvgAggregateInputType;
    _sum?: PartSumAggregateInputType;
    _min?: PartMinAggregateInputType;
    _max?: PartMaxAggregateInputType;
};
export type PartGroupByOutputType = {
    id: string;
    name: string;
    sku: string;
    category: string;
    description: string | null;
    sellingPrice: runtime.Decimal;
    createdAt: Date;
    updatedAt: Date;
    _count: PartCountAggregateOutputType | null;
    _avg: PartAvgAggregateOutputType | null;
    _sum: PartSumAggregateOutputType | null;
    _min: PartMinAggregateOutputType | null;
    _max: PartMaxAggregateOutputType | null;
};
export type GetPartGroupByPayload<T extends PartGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PartGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PartGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PartGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PartGroupByOutputType[P]>;
}>>;
export type PartWhereInput = {
    AND?: Prisma.PartWhereInput | Prisma.PartWhereInput[];
    OR?: Prisma.PartWhereInput[];
    NOT?: Prisma.PartWhereInput | Prisma.PartWhereInput[];
    id?: Prisma.StringFilter<"Part"> | string;
    name?: Prisma.StringFilter<"Part"> | string;
    sku?: Prisma.StringFilter<"Part"> | string;
    category?: Prisma.StringFilter<"Part"> | string;
    description?: Prisma.StringNullableFilter<"Part"> | string | null;
    sellingPrice?: Prisma.DecimalFilter<"Part"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"Part"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Part"> | Date | string;
    inventories?: Prisma.PartInventoryListRelationFilter;
};
export type PartOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    sellingPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inventories?: Prisma.PartInventoryOrderByRelationAggregateInput;
};
export type PartWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    sku?: string;
    AND?: Prisma.PartWhereInput | Prisma.PartWhereInput[];
    OR?: Prisma.PartWhereInput[];
    NOT?: Prisma.PartWhereInput | Prisma.PartWhereInput[];
    name?: Prisma.StringFilter<"Part"> | string;
    category?: Prisma.StringFilter<"Part"> | string;
    description?: Prisma.StringNullableFilter<"Part"> | string | null;
    sellingPrice?: Prisma.DecimalFilter<"Part"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"Part"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Part"> | Date | string;
    inventories?: Prisma.PartInventoryListRelationFilter;
}, "id" | "sku">;
export type PartOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    sellingPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PartCountOrderByAggregateInput;
    _avg?: Prisma.PartAvgOrderByAggregateInput;
    _max?: Prisma.PartMaxOrderByAggregateInput;
    _min?: Prisma.PartMinOrderByAggregateInput;
    _sum?: Prisma.PartSumOrderByAggregateInput;
};
export type PartScalarWhereWithAggregatesInput = {
    AND?: Prisma.PartScalarWhereWithAggregatesInput | Prisma.PartScalarWhereWithAggregatesInput[];
    OR?: Prisma.PartScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PartScalarWhereWithAggregatesInput | Prisma.PartScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Part"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Part"> | string;
    sku?: Prisma.StringWithAggregatesFilter<"Part"> | string;
    category?: Prisma.StringWithAggregatesFilter<"Part"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Part"> | string | null;
    sellingPrice?: Prisma.DecimalWithAggregatesFilter<"Part"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Part"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Part"> | Date | string;
};
export type PartCreateInput = {
    id?: string;
    name: string;
    sku: string;
    category: string;
    description?: string | null;
    sellingPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventories?: Prisma.PartInventoryCreateNestedManyWithoutPartInput;
};
export type PartUncheckedCreateInput = {
    id?: string;
    name: string;
    sku: string;
    category: string;
    description?: string | null;
    sellingPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventories?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutPartInput;
};
export type PartUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellingPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventories?: Prisma.PartInventoryUpdateManyWithoutPartNestedInput;
};
export type PartUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellingPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventories?: Prisma.PartInventoryUncheckedUpdateManyWithoutPartNestedInput;
};
export type PartCreateManyInput = {
    id?: string;
    name: string;
    sku: string;
    category: string;
    description?: string | null;
    sellingPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PartUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellingPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellingPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sellingPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PartAvgOrderByAggregateInput = {
    sellingPrice?: Prisma.SortOrder;
};
export type PartMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sellingPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PartMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sellingPrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PartSumOrderByAggregateInput = {
    sellingPrice?: Prisma.SortOrder;
};
export type PartScalarRelationFilter = {
    is?: Prisma.PartWhereInput;
    isNot?: Prisma.PartWhereInput;
};
export type PartCreateNestedOneWithoutInventoriesInput = {
    create?: Prisma.XOR<Prisma.PartCreateWithoutInventoriesInput, Prisma.PartUncheckedCreateWithoutInventoriesInput>;
    connectOrCreate?: Prisma.PartCreateOrConnectWithoutInventoriesInput;
    connect?: Prisma.PartWhereUniqueInput;
};
export type PartUpdateOneRequiredWithoutInventoriesNestedInput = {
    create?: Prisma.XOR<Prisma.PartCreateWithoutInventoriesInput, Prisma.PartUncheckedCreateWithoutInventoriesInput>;
    connectOrCreate?: Prisma.PartCreateOrConnectWithoutInventoriesInput;
    upsert?: Prisma.PartUpsertWithoutInventoriesInput;
    connect?: Prisma.PartWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PartUpdateToOneWithWhereWithoutInventoriesInput, Prisma.PartUpdateWithoutInventoriesInput>, Prisma.PartUncheckedUpdateWithoutInventoriesInput>;
};
export type PartCreateWithoutInventoriesInput = {
    id?: string;
    name: string;
    sku: string;
    category: string;
    description?: string | null;
    sellingPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PartUncheckedCreateWithoutInventoriesInput = {
    id?: string;
    name: string;
    sku: string;
    category: string;
    description?: string | null;
    sellingPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PartCreateOrConnectWithoutInventoriesInput = {
    where: Prisma.PartWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartCreateWithoutInventoriesInput, Prisma.PartUncheckedCreateWithoutInventoriesInput>;
};
export type PartUpsertWithoutInventoriesInput = {
    update: Prisma.XOR<Prisma.PartUpdateWithoutInventoriesInput, Prisma.PartUncheckedUpdateWithoutInventoriesInput>;
    create: Prisma.XOR<Prisma.PartCreateWithoutInventoriesInput, Prisma.PartUncheckedCreateWithoutInventoriesInput>;
    where?: Prisma.PartWhereInput;
};
export type PartUpdateToOneWithWhereWithoutInventoriesInput = {
    where?: Prisma.PartWhereInput;
    data: Prisma.XOR<Prisma.PartUpdateWithoutInventoriesInput, Prisma.PartUncheckedUpdateWithoutInventoriesInput>;
};
export type PartUpdateWithoutInventoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellingPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartUncheckedUpdateWithoutInventoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sellingPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartCountOutputType = {
    inventories: number;
};
export type PartCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inventories?: boolean | PartCountOutputTypeCountInventoriesArgs;
};
export type PartCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartCountOutputTypeSelect<ExtArgs> | null;
};
export type PartCountOutputTypeCountInventoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartInventoryWhereInput;
};
export type PartSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    category?: boolean;
    description?: boolean;
    sellingPrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inventories?: boolean | Prisma.Part$inventoriesArgs<ExtArgs>;
    _count?: boolean | Prisma.PartCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["part"]>;
export type PartSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    category?: boolean;
    description?: boolean;
    sellingPrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["part"]>;
export type PartSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    category?: boolean;
    description?: boolean;
    sellingPrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["part"]>;
export type PartSelectScalar = {
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    category?: boolean;
    description?: boolean;
    sellingPrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PartOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "sku" | "category" | "description" | "sellingPrice" | "createdAt" | "updatedAt", ExtArgs["result"]["part"]>;
export type PartInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inventories?: boolean | Prisma.Part$inventoriesArgs<ExtArgs>;
    _count?: boolean | Prisma.PartCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PartIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PartIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PartPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Part";
    objects: {
        inventories: Prisma.$PartInventoryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        sku: string;
        category: string;
        description: string | null;
        sellingPrice: runtime.Decimal;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["part"]>;
    composites: {};
};
export type PartGetPayload<S extends boolean | null | undefined | PartDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PartPayload, S>;
export type PartCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PartFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PartCountAggregateInputType | true;
};
export interface PartDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Part'];
        meta: {
            name: 'Part';
        };
    };
    findUnique<T extends PartFindUniqueArgs>(args: Prisma.SelectSubset<T, PartFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PartFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PartFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PartFindFirstArgs>(args?: Prisma.SelectSubset<T, PartFindFirstArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PartFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PartFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PartFindManyArgs>(args?: Prisma.SelectSubset<T, PartFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PartCreateArgs>(args: Prisma.SelectSubset<T, PartCreateArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PartCreateManyArgs>(args?: Prisma.SelectSubset<T, PartCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PartCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PartCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PartDeleteArgs>(args: Prisma.SelectSubset<T, PartDeleteArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PartUpdateArgs>(args: Prisma.SelectSubset<T, PartUpdateArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PartDeleteManyArgs>(args?: Prisma.SelectSubset<T, PartDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PartUpdateManyArgs>(args: Prisma.SelectSubset<T, PartUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PartUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PartUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PartUpsertArgs>(args: Prisma.SelectSubset<T, PartUpsertArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PartCountArgs>(args?: Prisma.Subset<T, PartCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PartCountAggregateOutputType> : number>;
    aggregate<T extends PartAggregateArgs>(args: Prisma.Subset<T, PartAggregateArgs>): Prisma.PrismaPromise<GetPartAggregateType<T>>;
    groupBy<T extends PartGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PartGroupByArgs['orderBy'];
    } : {
        orderBy?: PartGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PartGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PartFieldRefs;
}
export interface Prisma__PartClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    inventories<T extends Prisma.Part$inventoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Part$inventoriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PartFieldRefs {
    readonly id: Prisma.FieldRef<"Part", 'String'>;
    readonly name: Prisma.FieldRef<"Part", 'String'>;
    readonly sku: Prisma.FieldRef<"Part", 'String'>;
    readonly category: Prisma.FieldRef<"Part", 'String'>;
    readonly description: Prisma.FieldRef<"Part", 'String'>;
    readonly sellingPrice: Prisma.FieldRef<"Part", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"Part", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Part", 'DateTime'>;
}
export type PartFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where: Prisma.PartWhereUniqueInput;
};
export type PartFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where: Prisma.PartWhereUniqueInput;
};
export type PartFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where?: Prisma.PartWhereInput;
    orderBy?: Prisma.PartOrderByWithRelationInput | Prisma.PartOrderByWithRelationInput[];
    cursor?: Prisma.PartWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartScalarFieldEnum | Prisma.PartScalarFieldEnum[];
};
export type PartFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where?: Prisma.PartWhereInput;
    orderBy?: Prisma.PartOrderByWithRelationInput | Prisma.PartOrderByWithRelationInput[];
    cursor?: Prisma.PartWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartScalarFieldEnum | Prisma.PartScalarFieldEnum[];
};
export type PartFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where?: Prisma.PartWhereInput;
    orderBy?: Prisma.PartOrderByWithRelationInput | Prisma.PartOrderByWithRelationInput[];
    cursor?: Prisma.PartWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartScalarFieldEnum | Prisma.PartScalarFieldEnum[];
};
export type PartCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartCreateInput, Prisma.PartUncheckedCreateInput>;
};
export type PartCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PartCreateManyInput | Prisma.PartCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PartCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    data: Prisma.PartCreateManyInput | Prisma.PartCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PartUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartUpdateInput, Prisma.PartUncheckedUpdateInput>;
    where: Prisma.PartWhereUniqueInput;
};
export type PartUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PartUpdateManyMutationInput, Prisma.PartUncheckedUpdateManyInput>;
    where?: Prisma.PartWhereInput;
    limit?: number;
};
export type PartUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartUpdateManyMutationInput, Prisma.PartUncheckedUpdateManyInput>;
    where?: Prisma.PartWhereInput;
    limit?: number;
};
export type PartUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where: Prisma.PartWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartCreateInput, Prisma.PartUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PartUpdateInput, Prisma.PartUncheckedUpdateInput>;
};
export type PartDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
    where: Prisma.PartWhereUniqueInput;
};
export type PartDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartWhereInput;
    limit?: number;
};
export type Part$inventoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    where?: Prisma.PartInventoryWhereInput;
    orderBy?: Prisma.PartInventoryOrderByWithRelationInput | Prisma.PartInventoryOrderByWithRelationInput[];
    cursor?: Prisma.PartInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartInventoryScalarFieldEnum | Prisma.PartInventoryScalarFieldEnum[];
};
export type PartDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartSelect<ExtArgs> | null;
    omit?: Prisma.PartOmit<ExtArgs> | null;
    include?: Prisma.PartInclude<ExtArgs> | null;
};
