import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type PartInventoryModel = runtime.Types.Result.DefaultSelection<Prisma.$PartInventoryPayload>;
export type AggregatePartInventory = {
    _count: PartInventoryCountAggregateOutputType | null;
    _avg: PartInventoryAvgAggregateOutputType | null;
    _sum: PartInventorySumAggregateOutputType | null;
    _min: PartInventoryMinAggregateOutputType | null;
    _max: PartInventoryMaxAggregateOutputType | null;
};
export type PartInventoryAvgAggregateOutputType = {
    quantity: number | null;
    reservedQuantity: number | null;
    reorderLevel: number | null;
};
export type PartInventorySumAggregateOutputType = {
    quantity: number | null;
    reservedQuantity: number | null;
    reorderLevel: number | null;
};
export type PartInventoryMinAggregateOutputType = {
    id: string | null;
    partId: string | null;
    branchId: string | null;
    quantity: number | null;
    reservedQuantity: number | null;
    reorderLevel: number | null;
    updatedAt: Date | null;
};
export type PartInventoryMaxAggregateOutputType = {
    id: string | null;
    partId: string | null;
    branchId: string | null;
    quantity: number | null;
    reservedQuantity: number | null;
    reorderLevel: number | null;
    updatedAt: Date | null;
};
export type PartInventoryCountAggregateOutputType = {
    id: number;
    partId: number;
    branchId: number;
    quantity: number;
    reservedQuantity: number;
    reorderLevel: number;
    updatedAt: number;
    _all: number;
};
export type PartInventoryAvgAggregateInputType = {
    quantity?: true;
    reservedQuantity?: true;
    reorderLevel?: true;
};
export type PartInventorySumAggregateInputType = {
    quantity?: true;
    reservedQuantity?: true;
    reorderLevel?: true;
};
export type PartInventoryMinAggregateInputType = {
    id?: true;
    partId?: true;
    branchId?: true;
    quantity?: true;
    reservedQuantity?: true;
    reorderLevel?: true;
    updatedAt?: true;
};
export type PartInventoryMaxAggregateInputType = {
    id?: true;
    partId?: true;
    branchId?: true;
    quantity?: true;
    reservedQuantity?: true;
    reorderLevel?: true;
    updatedAt?: true;
};
export type PartInventoryCountAggregateInputType = {
    id?: true;
    partId?: true;
    branchId?: true;
    quantity?: true;
    reservedQuantity?: true;
    reorderLevel?: true;
    updatedAt?: true;
    _all?: true;
};
export type PartInventoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartInventoryWhereInput;
    orderBy?: Prisma.PartInventoryOrderByWithRelationInput | Prisma.PartInventoryOrderByWithRelationInput[];
    cursor?: Prisma.PartInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PartInventoryCountAggregateInputType;
    _avg?: PartInventoryAvgAggregateInputType;
    _sum?: PartInventorySumAggregateInputType;
    _min?: PartInventoryMinAggregateInputType;
    _max?: PartInventoryMaxAggregateInputType;
};
export type GetPartInventoryAggregateType<T extends PartInventoryAggregateArgs> = {
    [P in keyof T & keyof AggregatePartInventory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePartInventory[P]> : Prisma.GetScalarType<T[P], AggregatePartInventory[P]>;
};
export type PartInventoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartInventoryWhereInput;
    orderBy?: Prisma.PartInventoryOrderByWithAggregationInput | Prisma.PartInventoryOrderByWithAggregationInput[];
    by: Prisma.PartInventoryScalarFieldEnum[] | Prisma.PartInventoryScalarFieldEnum;
    having?: Prisma.PartInventoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PartInventoryCountAggregateInputType | true;
    _avg?: PartInventoryAvgAggregateInputType;
    _sum?: PartInventorySumAggregateInputType;
    _min?: PartInventoryMinAggregateInputType;
    _max?: PartInventoryMaxAggregateInputType;
};
export type PartInventoryGroupByOutputType = {
    id: string;
    partId: string;
    branchId: string;
    quantity: number;
    reservedQuantity: number;
    reorderLevel: number;
    updatedAt: Date;
    _count: PartInventoryCountAggregateOutputType | null;
    _avg: PartInventoryAvgAggregateOutputType | null;
    _sum: PartInventorySumAggregateOutputType | null;
    _min: PartInventoryMinAggregateOutputType | null;
    _max: PartInventoryMaxAggregateOutputType | null;
};
export type GetPartInventoryGroupByPayload<T extends PartInventoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PartInventoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PartInventoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PartInventoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PartInventoryGroupByOutputType[P]>;
}>>;
export type PartInventoryWhereInput = {
    AND?: Prisma.PartInventoryWhereInput | Prisma.PartInventoryWhereInput[];
    OR?: Prisma.PartInventoryWhereInput[];
    NOT?: Prisma.PartInventoryWhereInput | Prisma.PartInventoryWhereInput[];
    id?: Prisma.StringFilter<"PartInventory"> | string;
    partId?: Prisma.StringFilter<"PartInventory"> | string;
    branchId?: Prisma.StringFilter<"PartInventory"> | string;
    quantity?: Prisma.IntFilter<"PartInventory"> | number;
    reservedQuantity?: Prisma.IntFilter<"PartInventory"> | number;
    reorderLevel?: Prisma.IntFilter<"PartInventory"> | number;
    updatedAt?: Prisma.DateTimeFilter<"PartInventory"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
    part?: Prisma.XOR<Prisma.PartScalarRelationFilter, Prisma.PartWhereInput>;
    partOrders?: Prisma.PartOrderListRelationFilter;
    stockMovements?: Prisma.StockMovementListRelationFilter;
};
export type PartInventoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
    part?: Prisma.PartOrderByWithRelationInput;
    partOrders?: Prisma.PartOrderOrderByRelationAggregateInput;
    stockMovements?: Prisma.StockMovementOrderByRelationAggregateInput;
};
export type PartInventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    partId_branchId?: Prisma.PartInventoryPartIdBranchIdCompoundUniqueInput;
    AND?: Prisma.PartInventoryWhereInput | Prisma.PartInventoryWhereInput[];
    OR?: Prisma.PartInventoryWhereInput[];
    NOT?: Prisma.PartInventoryWhereInput | Prisma.PartInventoryWhereInput[];
    partId?: Prisma.StringFilter<"PartInventory"> | string;
    branchId?: Prisma.StringFilter<"PartInventory"> | string;
    quantity?: Prisma.IntFilter<"PartInventory"> | number;
    reservedQuantity?: Prisma.IntFilter<"PartInventory"> | number;
    reorderLevel?: Prisma.IntFilter<"PartInventory"> | number;
    updatedAt?: Prisma.DateTimeFilter<"PartInventory"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
    part?: Prisma.XOR<Prisma.PartScalarRelationFilter, Prisma.PartWhereInput>;
    partOrders?: Prisma.PartOrderListRelationFilter;
    stockMovements?: Prisma.StockMovementListRelationFilter;
}, "id" | "partId_branchId">;
export type PartInventoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PartInventoryCountOrderByAggregateInput;
    _avg?: Prisma.PartInventoryAvgOrderByAggregateInput;
    _max?: Prisma.PartInventoryMaxOrderByAggregateInput;
    _min?: Prisma.PartInventoryMinOrderByAggregateInput;
    _sum?: Prisma.PartInventorySumOrderByAggregateInput;
};
export type PartInventoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.PartInventoryScalarWhereWithAggregatesInput | Prisma.PartInventoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.PartInventoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PartInventoryScalarWhereWithAggregatesInput | Prisma.PartInventoryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PartInventory"> | string;
    partId?: Prisma.StringWithAggregatesFilter<"PartInventory"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"PartInventory"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"PartInventory"> | number;
    reservedQuantity?: Prisma.IntWithAggregatesFilter<"PartInventory"> | number;
    reorderLevel?: Prisma.IntWithAggregatesFilter<"PartInventory"> | number;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PartInventory"> | Date | string;
};
export type PartInventoryCreateInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutPartInventoryInput;
    part: Prisma.PartCreateNestedOneWithoutInventoriesInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutPartInventoryInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryUncheckedCreateInput = {
    id?: string;
    partId: string;
    branchId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPartInventoryInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutPartInventoryNestedInput;
    part?: Prisma.PartUpdateOneRequiredWithoutInventoriesNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutPartInventoryNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutPartInventoryNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryCreateManyInput = {
    id?: string;
    partId: string;
    branchId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
};
export type PartInventoryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartInventoryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartInventoryListRelationFilter = {
    every?: Prisma.PartInventoryWhereInput;
    some?: Prisma.PartInventoryWhereInput;
    none?: Prisma.PartInventoryWhereInput;
};
export type PartInventoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PartInventoryPartIdBranchIdCompoundUniqueInput = {
    partId: string;
    branchId: string;
};
export type PartInventoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PartInventoryAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
};
export type PartInventoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PartInventoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PartInventorySumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    reservedQuantity?: Prisma.SortOrder;
    reorderLevel?: Prisma.SortOrder;
};
export type PartInventoryScalarRelationFilter = {
    is?: Prisma.PartInventoryWhereInput;
    isNot?: Prisma.PartInventoryWhereInput;
};
export type PartInventoryCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutBranchInput, Prisma.PartInventoryUncheckedCreateWithoutBranchInput> | Prisma.PartInventoryCreateWithoutBranchInput[] | Prisma.PartInventoryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutBranchInput | Prisma.PartInventoryCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.PartInventoryCreateManyBranchInputEnvelope;
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
};
export type PartInventoryUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutBranchInput, Prisma.PartInventoryUncheckedCreateWithoutBranchInput> | Prisma.PartInventoryCreateWithoutBranchInput[] | Prisma.PartInventoryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutBranchInput | Prisma.PartInventoryCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.PartInventoryCreateManyBranchInputEnvelope;
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
};
export type PartInventoryUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutBranchInput, Prisma.PartInventoryUncheckedCreateWithoutBranchInput> | Prisma.PartInventoryCreateWithoutBranchInput[] | Prisma.PartInventoryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutBranchInput | Prisma.PartInventoryCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.PartInventoryUpsertWithWhereUniqueWithoutBranchInput | Prisma.PartInventoryUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.PartInventoryCreateManyBranchInputEnvelope;
    set?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    disconnect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    delete?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    update?: Prisma.PartInventoryUpdateWithWhereUniqueWithoutBranchInput | Prisma.PartInventoryUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.PartInventoryUpdateManyWithWhereWithoutBranchInput | Prisma.PartInventoryUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.PartInventoryScalarWhereInput | Prisma.PartInventoryScalarWhereInput[];
};
export type PartInventoryUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutBranchInput, Prisma.PartInventoryUncheckedCreateWithoutBranchInput> | Prisma.PartInventoryCreateWithoutBranchInput[] | Prisma.PartInventoryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutBranchInput | Prisma.PartInventoryCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.PartInventoryUpsertWithWhereUniqueWithoutBranchInput | Prisma.PartInventoryUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.PartInventoryCreateManyBranchInputEnvelope;
    set?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    disconnect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    delete?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    update?: Prisma.PartInventoryUpdateWithWhereUniqueWithoutBranchInput | Prisma.PartInventoryUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.PartInventoryUpdateManyWithWhereWithoutBranchInput | Prisma.PartInventoryUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.PartInventoryScalarWhereInput | Prisma.PartInventoryScalarWhereInput[];
};
export type PartInventoryCreateNestedManyWithoutPartInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartInput, Prisma.PartInventoryUncheckedCreateWithoutPartInput> | Prisma.PartInventoryCreateWithoutPartInput[] | Prisma.PartInventoryUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutPartInput | Prisma.PartInventoryCreateOrConnectWithoutPartInput[];
    createMany?: Prisma.PartInventoryCreateManyPartInputEnvelope;
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
};
export type PartInventoryUncheckedCreateNestedManyWithoutPartInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartInput, Prisma.PartInventoryUncheckedCreateWithoutPartInput> | Prisma.PartInventoryCreateWithoutPartInput[] | Prisma.PartInventoryUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutPartInput | Prisma.PartInventoryCreateOrConnectWithoutPartInput[];
    createMany?: Prisma.PartInventoryCreateManyPartInputEnvelope;
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
};
export type PartInventoryUpdateManyWithoutPartNestedInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartInput, Prisma.PartInventoryUncheckedCreateWithoutPartInput> | Prisma.PartInventoryCreateWithoutPartInput[] | Prisma.PartInventoryUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutPartInput | Prisma.PartInventoryCreateOrConnectWithoutPartInput[];
    upsert?: Prisma.PartInventoryUpsertWithWhereUniqueWithoutPartInput | Prisma.PartInventoryUpsertWithWhereUniqueWithoutPartInput[];
    createMany?: Prisma.PartInventoryCreateManyPartInputEnvelope;
    set?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    disconnect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    delete?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    update?: Prisma.PartInventoryUpdateWithWhereUniqueWithoutPartInput | Prisma.PartInventoryUpdateWithWhereUniqueWithoutPartInput[];
    updateMany?: Prisma.PartInventoryUpdateManyWithWhereWithoutPartInput | Prisma.PartInventoryUpdateManyWithWhereWithoutPartInput[];
    deleteMany?: Prisma.PartInventoryScalarWhereInput | Prisma.PartInventoryScalarWhereInput[];
};
export type PartInventoryUncheckedUpdateManyWithoutPartNestedInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartInput, Prisma.PartInventoryUncheckedCreateWithoutPartInput> | Prisma.PartInventoryCreateWithoutPartInput[] | Prisma.PartInventoryUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutPartInput | Prisma.PartInventoryCreateOrConnectWithoutPartInput[];
    upsert?: Prisma.PartInventoryUpsertWithWhereUniqueWithoutPartInput | Prisma.PartInventoryUpsertWithWhereUniqueWithoutPartInput[];
    createMany?: Prisma.PartInventoryCreateManyPartInputEnvelope;
    set?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    disconnect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    delete?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    connect?: Prisma.PartInventoryWhereUniqueInput | Prisma.PartInventoryWhereUniqueInput[];
    update?: Prisma.PartInventoryUpdateWithWhereUniqueWithoutPartInput | Prisma.PartInventoryUpdateWithWhereUniqueWithoutPartInput[];
    updateMany?: Prisma.PartInventoryUpdateManyWithWhereWithoutPartInput | Prisma.PartInventoryUpdateManyWithWhereWithoutPartInput[];
    deleteMany?: Prisma.PartInventoryScalarWhereInput | Prisma.PartInventoryScalarWhereInput[];
};
export type PartInventoryCreateNestedOneWithoutStockMovementsInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutStockMovementsInput, Prisma.PartInventoryUncheckedCreateWithoutStockMovementsInput>;
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutStockMovementsInput;
    connect?: Prisma.PartInventoryWhereUniqueInput;
};
export type PartInventoryUpdateOneRequiredWithoutStockMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutStockMovementsInput, Prisma.PartInventoryUncheckedCreateWithoutStockMovementsInput>;
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutStockMovementsInput;
    upsert?: Prisma.PartInventoryUpsertWithoutStockMovementsInput;
    connect?: Prisma.PartInventoryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PartInventoryUpdateToOneWithWhereWithoutStockMovementsInput, Prisma.PartInventoryUpdateWithoutStockMovementsInput>, Prisma.PartInventoryUncheckedUpdateWithoutStockMovementsInput>;
};
export type PartInventoryCreateNestedOneWithoutPartOrdersInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartOrdersInput, Prisma.PartInventoryUncheckedCreateWithoutPartOrdersInput>;
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutPartOrdersInput;
    connect?: Prisma.PartInventoryWhereUniqueInput;
};
export type PartInventoryUpdateOneRequiredWithoutPartOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartOrdersInput, Prisma.PartInventoryUncheckedCreateWithoutPartOrdersInput>;
    connectOrCreate?: Prisma.PartInventoryCreateOrConnectWithoutPartOrdersInput;
    upsert?: Prisma.PartInventoryUpsertWithoutPartOrdersInput;
    connect?: Prisma.PartInventoryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PartInventoryUpdateToOneWithWhereWithoutPartOrdersInput, Prisma.PartInventoryUpdateWithoutPartOrdersInput>, Prisma.PartInventoryUncheckedUpdateWithoutPartOrdersInput>;
};
export type PartInventoryCreateWithoutBranchInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    part: Prisma.PartCreateNestedOneWithoutInventoriesInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutPartInventoryInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryUncheckedCreateWithoutBranchInput = {
    id?: string;
    partId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPartInventoryInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryCreateOrConnectWithoutBranchInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutBranchInput, Prisma.PartInventoryUncheckedCreateWithoutBranchInput>;
};
export type PartInventoryCreateManyBranchInputEnvelope = {
    data: Prisma.PartInventoryCreateManyBranchInput | Prisma.PartInventoryCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type PartInventoryUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.PartInventoryUpdateWithoutBranchInput, Prisma.PartInventoryUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutBranchInput, Prisma.PartInventoryUncheckedCreateWithoutBranchInput>;
};
export type PartInventoryUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.PartInventoryUpdateWithoutBranchInput, Prisma.PartInventoryUncheckedUpdateWithoutBranchInput>;
};
export type PartInventoryUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.PartInventoryScalarWhereInput;
    data: Prisma.XOR<Prisma.PartInventoryUpdateManyMutationInput, Prisma.PartInventoryUncheckedUpdateManyWithoutBranchInput>;
};
export type PartInventoryScalarWhereInput = {
    AND?: Prisma.PartInventoryScalarWhereInput | Prisma.PartInventoryScalarWhereInput[];
    OR?: Prisma.PartInventoryScalarWhereInput[];
    NOT?: Prisma.PartInventoryScalarWhereInput | Prisma.PartInventoryScalarWhereInput[];
    id?: Prisma.StringFilter<"PartInventory"> | string;
    partId?: Prisma.StringFilter<"PartInventory"> | string;
    branchId?: Prisma.StringFilter<"PartInventory"> | string;
    quantity?: Prisma.IntFilter<"PartInventory"> | number;
    reservedQuantity?: Prisma.IntFilter<"PartInventory"> | number;
    reorderLevel?: Prisma.IntFilter<"PartInventory"> | number;
    updatedAt?: Prisma.DateTimeFilter<"PartInventory"> | Date | string;
};
export type PartInventoryCreateWithoutPartInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutPartInventoryInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutPartInventoryInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryUncheckedCreateWithoutPartInput = {
    id?: string;
    branchId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPartInventoryInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryCreateOrConnectWithoutPartInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartInput, Prisma.PartInventoryUncheckedCreateWithoutPartInput>;
};
export type PartInventoryCreateManyPartInputEnvelope = {
    data: Prisma.PartInventoryCreateManyPartInput | Prisma.PartInventoryCreateManyPartInput[];
    skipDuplicates?: boolean;
};
export type PartInventoryUpsertWithWhereUniqueWithoutPartInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.PartInventoryUpdateWithoutPartInput, Prisma.PartInventoryUncheckedUpdateWithoutPartInput>;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartInput, Prisma.PartInventoryUncheckedCreateWithoutPartInput>;
};
export type PartInventoryUpdateWithWhereUniqueWithoutPartInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.PartInventoryUpdateWithoutPartInput, Prisma.PartInventoryUncheckedUpdateWithoutPartInput>;
};
export type PartInventoryUpdateManyWithWhereWithoutPartInput = {
    where: Prisma.PartInventoryScalarWhereInput;
    data: Prisma.XOR<Prisma.PartInventoryUpdateManyMutationInput, Prisma.PartInventoryUncheckedUpdateManyWithoutPartInput>;
};
export type PartInventoryCreateWithoutStockMovementsInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutPartInventoryInput;
    part: Prisma.PartCreateNestedOneWithoutInventoriesInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutPartInventoryInput;
};
export type PartInventoryUncheckedCreateWithoutStockMovementsInput = {
    id?: string;
    partId: string;
    branchId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPartInventoryInput;
};
export type PartInventoryCreateOrConnectWithoutStockMovementsInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutStockMovementsInput, Prisma.PartInventoryUncheckedCreateWithoutStockMovementsInput>;
};
export type PartInventoryUpsertWithoutStockMovementsInput = {
    update: Prisma.XOR<Prisma.PartInventoryUpdateWithoutStockMovementsInput, Prisma.PartInventoryUncheckedUpdateWithoutStockMovementsInput>;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutStockMovementsInput, Prisma.PartInventoryUncheckedCreateWithoutStockMovementsInput>;
    where?: Prisma.PartInventoryWhereInput;
};
export type PartInventoryUpdateToOneWithWhereWithoutStockMovementsInput = {
    where?: Prisma.PartInventoryWhereInput;
    data: Prisma.XOR<Prisma.PartInventoryUpdateWithoutStockMovementsInput, Prisma.PartInventoryUncheckedUpdateWithoutStockMovementsInput>;
};
export type PartInventoryUpdateWithoutStockMovementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutPartInventoryNestedInput;
    part?: Prisma.PartUpdateOneRequiredWithoutInventoriesNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutPartInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateWithoutStockMovementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutPartInventoryNestedInput;
};
export type PartInventoryCreateWithoutPartOrdersInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutPartInventoryInput;
    part: Prisma.PartCreateNestedOneWithoutInventoriesInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryUncheckedCreateWithoutPartOrdersInput = {
    id?: string;
    partId: string;
    branchId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutInventoryInput;
};
export type PartInventoryCreateOrConnectWithoutPartOrdersInput = {
    where: Prisma.PartInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartOrdersInput, Prisma.PartInventoryUncheckedCreateWithoutPartOrdersInput>;
};
export type PartInventoryUpsertWithoutPartOrdersInput = {
    update: Prisma.XOR<Prisma.PartInventoryUpdateWithoutPartOrdersInput, Prisma.PartInventoryUncheckedUpdateWithoutPartOrdersInput>;
    create: Prisma.XOR<Prisma.PartInventoryCreateWithoutPartOrdersInput, Prisma.PartInventoryUncheckedCreateWithoutPartOrdersInput>;
    where?: Prisma.PartInventoryWhereInput;
};
export type PartInventoryUpdateToOneWithWhereWithoutPartOrdersInput = {
    where?: Prisma.PartInventoryWhereInput;
    data: Prisma.XOR<Prisma.PartInventoryUpdateWithoutPartOrdersInput, Prisma.PartInventoryUncheckedUpdateWithoutPartOrdersInput>;
};
export type PartInventoryUpdateWithoutPartOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutPartInventoryNestedInput;
    part?: Prisma.PartUpdateOneRequiredWithoutInventoriesNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateWithoutPartOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryCreateManyBranchInput = {
    id?: string;
    partId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
};
export type PartInventoryUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    part?: Prisma.PartUpdateOneRequiredWithoutInventoriesNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutPartInventoryNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutPartInventoryNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartInventoryCreateManyPartInput = {
    id?: string;
    branchId: string;
    quantity?: number;
    reservedQuantity?: number;
    reorderLevel?: number;
    updatedAt?: Date | string;
};
export type PartInventoryUpdateWithoutPartInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutPartInventoryNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutPartInventoryNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateWithoutPartInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutPartInventoryNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutInventoryNestedInput;
};
export type PartInventoryUncheckedUpdateManyWithoutPartInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reservedQuantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reorderLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PartInventoryCountOutputType = {
    partOrders: number;
    stockMovements: number;
};
export type PartInventoryCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    partOrders?: boolean | PartInventoryCountOutputTypeCountPartOrdersArgs;
    stockMovements?: boolean | PartInventoryCountOutputTypeCountStockMovementsArgs;
};
export type PartInventoryCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventoryCountOutputTypeSelect<ExtArgs> | null;
};
export type PartInventoryCountOutputTypeCountPartOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartOrderWhereInput;
};
export type PartInventoryCountOutputTypeCountStockMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
};
export type PartInventorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    reservedQuantity?: boolean;
    reorderLevel?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    partOrders?: boolean | Prisma.PartInventory$partOrdersArgs<ExtArgs>;
    stockMovements?: boolean | Prisma.PartInventory$stockMovementsArgs<ExtArgs>;
    _count?: boolean | Prisma.PartInventoryCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["partInventory"]>;
export type PartInventorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    reservedQuantity?: boolean;
    reorderLevel?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["partInventory"]>;
export type PartInventorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    reservedQuantity?: boolean;
    reorderLevel?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["partInventory"]>;
export type PartInventorySelectScalar = {
    id?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    reservedQuantity?: boolean;
    reorderLevel?: boolean;
    updatedAt?: boolean;
};
export type PartInventoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "partId" | "branchId" | "quantity" | "reservedQuantity" | "reorderLevel" | "updatedAt", ExtArgs["result"]["partInventory"]>;
export type PartInventoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    partOrders?: boolean | Prisma.PartInventory$partOrdersArgs<ExtArgs>;
    stockMovements?: boolean | Prisma.PartInventory$stockMovementsArgs<ExtArgs>;
    _count?: boolean | Prisma.PartInventoryCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PartInventoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
};
export type PartInventoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
};
export type $PartInventoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PartInventory";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
        part: Prisma.$PartPayload<ExtArgs>;
        partOrders: Prisma.$PartOrderPayload<ExtArgs>[];
        stockMovements: Prisma.$StockMovementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        partId: string;
        branchId: string;
        quantity: number;
        reservedQuantity: number;
        reorderLevel: number;
        updatedAt: Date;
    }, ExtArgs["result"]["partInventory"]>;
    composites: {};
};
export type PartInventoryGetPayload<S extends boolean | null | undefined | PartInventoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload, S>;
export type PartInventoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PartInventoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PartInventoryCountAggregateInputType | true;
};
export interface PartInventoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PartInventory'];
        meta: {
            name: 'PartInventory';
        };
    };
    findUnique<T extends PartInventoryFindUniqueArgs>(args: Prisma.SelectSubset<T, PartInventoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PartInventoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PartInventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PartInventoryFindFirstArgs>(args?: Prisma.SelectSubset<T, PartInventoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PartInventoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PartInventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PartInventoryFindManyArgs>(args?: Prisma.SelectSubset<T, PartInventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PartInventoryCreateArgs>(args: Prisma.SelectSubset<T, PartInventoryCreateArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PartInventoryCreateManyArgs>(args?: Prisma.SelectSubset<T, PartInventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PartInventoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PartInventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PartInventoryDeleteArgs>(args: Prisma.SelectSubset<T, PartInventoryDeleteArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PartInventoryUpdateArgs>(args: Prisma.SelectSubset<T, PartInventoryUpdateArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PartInventoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, PartInventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PartInventoryUpdateManyArgs>(args: Prisma.SelectSubset<T, PartInventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PartInventoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PartInventoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PartInventoryUpsertArgs>(args: Prisma.SelectSubset<T, PartInventoryUpsertArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PartInventoryCountArgs>(args?: Prisma.Subset<T, PartInventoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PartInventoryCountAggregateOutputType> : number>;
    aggregate<T extends PartInventoryAggregateArgs>(args: Prisma.Subset<T, PartInventoryAggregateArgs>): Prisma.PrismaPromise<GetPartInventoryAggregateType<T>>;
    groupBy<T extends PartInventoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PartInventoryGroupByArgs['orderBy'];
    } : {
        orderBy?: PartInventoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PartInventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PartInventoryFieldRefs;
}
export interface Prisma__PartInventoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branch<T extends Prisma.BranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BranchDefaultArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    part<T extends Prisma.PartDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PartDefaultArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    partOrders<T extends Prisma.PartInventory$partOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PartInventory$partOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    stockMovements<T extends Prisma.PartInventory$stockMovementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PartInventory$stockMovementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PartInventoryFieldRefs {
    readonly id: Prisma.FieldRef<"PartInventory", 'String'>;
    readonly partId: Prisma.FieldRef<"PartInventory", 'String'>;
    readonly branchId: Prisma.FieldRef<"PartInventory", 'String'>;
    readonly quantity: Prisma.FieldRef<"PartInventory", 'Int'>;
    readonly reservedQuantity: Prisma.FieldRef<"PartInventory", 'Int'>;
    readonly reorderLevel: Prisma.FieldRef<"PartInventory", 'Int'>;
    readonly updatedAt: Prisma.FieldRef<"PartInventory", 'DateTime'>;
}
export type PartInventoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    where: Prisma.PartInventoryWhereUniqueInput;
};
export type PartInventoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    where: Prisma.PartInventoryWhereUniqueInput;
};
export type PartInventoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PartInventoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PartInventoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PartInventoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartInventoryCreateInput, Prisma.PartInventoryUncheckedCreateInput>;
};
export type PartInventoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PartInventoryCreateManyInput | Prisma.PartInventoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PartInventoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    data: Prisma.PartInventoryCreateManyInput | Prisma.PartInventoryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PartInventoryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PartInventoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartInventoryUpdateInput, Prisma.PartInventoryUncheckedUpdateInput>;
    where: Prisma.PartInventoryWhereUniqueInput;
};
export type PartInventoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PartInventoryUpdateManyMutationInput, Prisma.PartInventoryUncheckedUpdateManyInput>;
    where?: Prisma.PartInventoryWhereInput;
    limit?: number;
};
export type PartInventoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartInventoryUpdateManyMutationInput, Prisma.PartInventoryUncheckedUpdateManyInput>;
    where?: Prisma.PartInventoryWhereInput;
    limit?: number;
    include?: Prisma.PartInventoryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PartInventoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    where: Prisma.PartInventoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartInventoryCreateInput, Prisma.PartInventoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PartInventoryUpdateInput, Prisma.PartInventoryUncheckedUpdateInput>;
};
export type PartInventoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    where: Prisma.PartInventoryWhereUniqueInput;
};
export type PartInventoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartInventoryWhereInput;
    limit?: number;
};
export type PartInventory$partOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartOrderSelect<ExtArgs> | null;
    omit?: Prisma.PartOrderOmit<ExtArgs> | null;
    include?: Prisma.PartOrderInclude<ExtArgs> | null;
    where?: Prisma.PartOrderWhereInput;
    orderBy?: Prisma.PartOrderOrderByWithRelationInput | Prisma.PartOrderOrderByWithRelationInput[];
    cursor?: Prisma.PartOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartOrderScalarFieldEnum | Prisma.PartOrderScalarFieldEnum[];
};
export type PartInventory$stockMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type PartInventoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
};
