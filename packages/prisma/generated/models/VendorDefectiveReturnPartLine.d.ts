import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorDefectiveReturnPartLineModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorDefectiveReturnPartLinePayload>;
export type AggregateVendorDefectiveReturnPartLine = {
    _count: VendorDefectiveReturnPartLineCountAggregateOutputType | null;
    _avg: VendorDefectiveReturnPartLineAvgAggregateOutputType | null;
    _sum: VendorDefectiveReturnPartLineSumAggregateOutputType | null;
    _min: VendorDefectiveReturnPartLineMinAggregateOutputType | null;
    _max: VendorDefectiveReturnPartLineMaxAggregateOutputType | null;
};
export type VendorDefectiveReturnPartLineAvgAggregateOutputType = {
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnPartLineSumAggregateOutputType = {
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnPartLineMinAggregateOutputType = {
    id: string | null;
    returnId: string | null;
    partInventoryId: string | null;
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnPartLineMaxAggregateOutputType = {
    id: string | null;
    returnId: string | null;
    partInventoryId: string | null;
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnPartLineCountAggregateOutputType = {
    id: number;
    returnId: number;
    partInventoryId: number;
    quantity: number;
    unitCost: number;
    totalCost: number;
    _all: number;
};
export type VendorDefectiveReturnPartLineAvgAggregateInputType = {
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorDefectiveReturnPartLineSumAggregateInputType = {
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorDefectiveReturnPartLineMinAggregateInputType = {
    id?: true;
    returnId?: true;
    partInventoryId?: true;
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorDefectiveReturnPartLineMaxAggregateInputType = {
    id?: true;
    returnId?: true;
    partInventoryId?: true;
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorDefectiveReturnPartLineCountAggregateInputType = {
    id?: true;
    returnId?: true;
    partInventoryId?: true;
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
    _all?: true;
};
export type VendorDefectiveReturnPartLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput | Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorDefectiveReturnPartLineCountAggregateInputType;
    _avg?: VendorDefectiveReturnPartLineAvgAggregateInputType;
    _sum?: VendorDefectiveReturnPartLineSumAggregateInputType;
    _min?: VendorDefectiveReturnPartLineMinAggregateInputType;
    _max?: VendorDefectiveReturnPartLineMaxAggregateInputType;
};
export type GetVendorDefectiveReturnPartLineAggregateType<T extends VendorDefectiveReturnPartLineAggregateArgs> = {
    [P in keyof T & keyof AggregateVendorDefectiveReturnPartLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendorDefectiveReturnPartLine[P]> : Prisma.GetScalarType<T[P], AggregateVendorDefectiveReturnPartLine[P]>;
};
export type VendorDefectiveReturnPartLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnPartLineOrderByWithAggregationInput | Prisma.VendorDefectiveReturnPartLineOrderByWithAggregationInput[];
    by: Prisma.VendorDefectiveReturnPartLineScalarFieldEnum[] | Prisma.VendorDefectiveReturnPartLineScalarFieldEnum;
    having?: Prisma.VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorDefectiveReturnPartLineCountAggregateInputType | true;
    _avg?: VendorDefectiveReturnPartLineAvgAggregateInputType;
    _sum?: VendorDefectiveReturnPartLineSumAggregateInputType;
    _min?: VendorDefectiveReturnPartLineMinAggregateInputType;
    _max?: VendorDefectiveReturnPartLineMaxAggregateInputType;
};
export type VendorDefectiveReturnPartLineGroupByOutputType = {
    id: string;
    returnId: string;
    partInventoryId: string;
    quantity: number;
    unitCost: runtime.Decimal;
    totalCost: runtime.Decimal;
    _count: VendorDefectiveReturnPartLineCountAggregateOutputType | null;
    _avg: VendorDefectiveReturnPartLineAvgAggregateOutputType | null;
    _sum: VendorDefectiveReturnPartLineSumAggregateOutputType | null;
    _min: VendorDefectiveReturnPartLineMinAggregateOutputType | null;
    _max: VendorDefectiveReturnPartLineMaxAggregateOutputType | null;
};
export type GetVendorDefectiveReturnPartLineGroupByPayload<T extends VendorDefectiveReturnPartLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorDefectiveReturnPartLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorDefectiveReturnPartLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorDefectiveReturnPartLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorDefectiveReturnPartLineGroupByOutputType[P]>;
}>>;
export type VendorDefectiveReturnPartLineWhereInput = {
    AND?: Prisma.VendorDefectiveReturnPartLineWhereInput | Prisma.VendorDefectiveReturnPartLineWhereInput[];
    OR?: Prisma.VendorDefectiveReturnPartLineWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnPartLineWhereInput | Prisma.VendorDefectiveReturnPartLineWhereInput[];
    id?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    returnId?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    partInventoryId?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    quantity?: Prisma.IntFilter<"VendorDefectiveReturnPartLine"> | number;
    unitCost?: Prisma.DecimalFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.XOR<Prisma.VendorDefectiveReturnScalarRelationFilter, Prisma.VendorDefectiveReturnWhereInput>;
    partInventory?: Prisma.XOR<Prisma.PartInventoryScalarRelationFilter, Prisma.PartInventoryWhereInput>;
};
export type VendorDefectiveReturnPartLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    partInventoryId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    return?: Prisma.VendorDefectiveReturnOrderByWithRelationInput;
    partInventory?: Prisma.PartInventoryOrderByWithRelationInput;
};
export type VendorDefectiveReturnPartLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.VendorDefectiveReturnPartLineWhereInput | Prisma.VendorDefectiveReturnPartLineWhereInput[];
    OR?: Prisma.VendorDefectiveReturnPartLineWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnPartLineWhereInput | Prisma.VendorDefectiveReturnPartLineWhereInput[];
    returnId?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    partInventoryId?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    quantity?: Prisma.IntFilter<"VendorDefectiveReturnPartLine"> | number;
    unitCost?: Prisma.DecimalFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.XOR<Prisma.VendorDefectiveReturnScalarRelationFilter, Prisma.VendorDefectiveReturnWhereInput>;
    partInventory?: Prisma.XOR<Prisma.PartInventoryScalarRelationFilter, Prisma.PartInventoryWhereInput>;
}, "id">;
export type VendorDefectiveReturnPartLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    partInventoryId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    _count?: Prisma.VendorDefectiveReturnPartLineCountOrderByAggregateInput;
    _avg?: Prisma.VendorDefectiveReturnPartLineAvgOrderByAggregateInput;
    _max?: Prisma.VendorDefectiveReturnPartLineMaxOrderByAggregateInput;
    _min?: Prisma.VendorDefectiveReturnPartLineMinOrderByAggregateInput;
    _sum?: Prisma.VendorDefectiveReturnPartLineSumOrderByAggregateInput;
};
export type VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput | Prisma.VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput | Prisma.VendorDefectiveReturnPartLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnPartLine"> | string;
    returnId?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnPartLine"> | string;
    partInventoryId?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnPartLine"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"VendorDefectiveReturnPartLine"> | number;
    unitCost?: Prisma.DecimalWithAggregatesFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalWithAggregatesFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineCreateInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    return: Prisma.VendorDefectiveReturnCreateNestedOneWithoutPartLinesInput;
    partInventory: Prisma.PartInventoryCreateNestedOneWithoutDefectiveReturnLinesInput;
};
export type VendorDefectiveReturnPartLineUncheckedCreateInput = {
    id?: string;
    returnId: string;
    partInventoryId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.VendorDefectiveReturnUpdateOneRequiredWithoutPartLinesNestedInput;
    partInventory?: Prisma.PartInventoryUpdateOneRequiredWithoutDefectiveReturnLinesNestedInput;
};
export type VendorDefectiveReturnPartLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    returnId?: Prisma.StringFieldUpdateOperationsInput | string;
    partInventoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineCreateManyInput = {
    id?: string;
    returnId: string;
    partInventoryId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    returnId?: Prisma.StringFieldUpdateOperationsInput | string;
    partInventoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineListRelationFilter = {
    every?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    some?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    none?: Prisma.VendorDefectiveReturnPartLineWhereInput;
};
export type VendorDefectiveReturnPartLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VendorDefectiveReturnPartLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    partInventoryId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnPartLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnPartLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    partInventoryId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnPartLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    partInventoryId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnPartLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnPartLineCreateNestedManyWithoutPartInventoryInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyPartInventoryInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
};
export type VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutPartInventoryInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyPartInventoryInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
};
export type VendorDefectiveReturnPartLineUpdateManyWithoutPartInventoryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput[];
    upsert?: Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutPartInventoryInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyPartInventoryInputEnvelope;
    set?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutPartInventoryInput[];
    updateMany?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutPartInventoryInput[];
    deleteMany?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput | Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
};
export type VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutPartInventoryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput[];
    upsert?: Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutPartInventoryInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyPartInventoryInputEnvelope;
    set?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutPartInventoryInput[];
    updateMany?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutPartInventoryInput | Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutPartInventoryInput[];
    deleteMany?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput | Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
};
export type VendorDefectiveReturnPartLineCreateNestedManyWithoutReturnInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyReturnInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
};
export type VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutReturnInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyReturnInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
};
export type VendorDefectiveReturnPartLineUpdateManyWithoutReturnNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput[];
    upsert?: Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyReturnInputEnvelope;
    set?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutReturnInput[];
    updateMany?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutReturnInput[];
    deleteMany?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput | Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
};
export type VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput[];
    upsert?: Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnPartLineCreateManyReturnInputEnvelope;
    set?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput | Prisma.VendorDefectiveReturnPartLineWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutReturnInput[];
    updateMany?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutReturnInput | Prisma.VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutReturnInput[];
    deleteMany?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput | Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
};
export type VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    return: Prisma.VendorDefectiveReturnCreateNestedOneWithoutPartLinesInput;
};
export type VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput = {
    id?: string;
    returnId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineCreateOrConnectWithoutPartInventoryInput = {
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput>;
};
export type VendorDefectiveReturnPartLineCreateManyPartInventoryInputEnvelope = {
    data: Prisma.VendorDefectiveReturnPartLineCreateManyPartInventoryInput | Prisma.VendorDefectiveReturnPartLineCreateManyPartInventoryInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutPartInventoryInput = {
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateWithoutPartInventoryInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutPartInventoryInput>;
};
export type VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutPartInventoryInput = {
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateWithoutPartInventoryInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateWithoutPartInventoryInput>;
};
export type VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutPartInventoryInput = {
    where: Prisma.VendorDefectiveReturnPartLineScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateManyMutationInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutPartInventoryInput>;
};
export type VendorDefectiveReturnPartLineScalarWhereInput = {
    AND?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput | Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
    OR?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnPartLineScalarWhereInput | Prisma.VendorDefectiveReturnPartLineScalarWhereInput[];
    id?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    returnId?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    partInventoryId?: Prisma.StringFilter<"VendorDefectiveReturnPartLine"> | string;
    quantity?: Prisma.IntFilter<"VendorDefectiveReturnPartLine"> | number;
    unitCost?: Prisma.DecimalFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFilter<"VendorDefectiveReturnPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineCreateWithoutReturnInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partInventory: Prisma.PartInventoryCreateNestedOneWithoutDefectiveReturnLinesInput;
};
export type VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput = {
    id?: string;
    partInventoryId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineCreateOrConnectWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput>;
};
export type VendorDefectiveReturnPartLineCreateManyReturnInputEnvelope = {
    data: Prisma.VendorDefectiveReturnPartLineCreateManyReturnInput | Prisma.VendorDefectiveReturnPartLineCreateManyReturnInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnPartLineUpsertWithWhereUniqueWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateWithoutReturnInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateWithoutReturnInput>;
};
export type VendorDefectiveReturnPartLineUpdateWithWhereUniqueWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateWithoutReturnInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateWithoutReturnInput>;
};
export type VendorDefectiveReturnPartLineUpdateManyWithWhereWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnPartLineScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateManyMutationInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnInput>;
};
export type VendorDefectiveReturnPartLineCreateManyPartInventoryInput = {
    id?: string;
    returnId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUpdateWithoutPartInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.VendorDefectiveReturnUpdateOneRequiredWithoutPartLinesNestedInput;
};
export type VendorDefectiveReturnPartLineUncheckedUpdateWithoutPartInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    returnId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutPartInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    returnId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineCreateManyReturnInput = {
    id?: string;
    partInventoryId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUpdateWithoutReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partInventory?: Prisma.PartInventoryUpdateOneRequiredWithoutDefectiveReturnLinesNestedInput;
};
export type VendorDefectiveReturnPartLineUncheckedUpdateWithoutReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partInventoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partInventoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnPartLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    returnId?: boolean;
    partInventoryId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
    partInventory?: boolean | Prisma.PartInventoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturnPartLine"]>;
export type VendorDefectiveReturnPartLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    returnId?: boolean;
    partInventoryId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
    partInventory?: boolean | Prisma.PartInventoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturnPartLine"]>;
export type VendorDefectiveReturnPartLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    returnId?: boolean;
    partInventoryId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
    partInventory?: boolean | Prisma.PartInventoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturnPartLine"]>;
export type VendorDefectiveReturnPartLineSelectScalar = {
    id?: boolean;
    returnId?: boolean;
    partInventoryId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
};
export type VendorDefectiveReturnPartLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "returnId" | "partInventoryId" | "quantity" | "unitCost" | "totalCost", ExtArgs["result"]["vendorDefectiveReturnPartLine"]>;
export type VendorDefectiveReturnPartLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
    partInventory?: boolean | Prisma.PartInventoryDefaultArgs<ExtArgs>;
};
export type VendorDefectiveReturnPartLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
    partInventory?: boolean | Prisma.PartInventoryDefaultArgs<ExtArgs>;
};
export type VendorDefectiveReturnPartLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
    partInventory?: boolean | Prisma.PartInventoryDefaultArgs<ExtArgs>;
};
export type $VendorDefectiveReturnPartLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VendorDefectiveReturnPartLine";
    objects: {
        return: Prisma.$VendorDefectiveReturnPayload<ExtArgs>;
        partInventory: Prisma.$PartInventoryPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        returnId: string;
        partInventoryId: string;
        quantity: number;
        unitCost: runtime.Decimal;
        totalCost: runtime.Decimal;
    }, ExtArgs["result"]["vendorDefectiveReturnPartLine"]>;
    composites: {};
};
export type VendorDefectiveReturnPartLineGetPayload<S extends boolean | null | undefined | VendorDefectiveReturnPartLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload, S>;
export type VendorDefectiveReturnPartLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorDefectiveReturnPartLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorDefectiveReturnPartLineCountAggregateInputType | true;
};
export interface VendorDefectiveReturnPartLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VendorDefectiveReturnPartLine'];
        meta: {
            name: 'VendorDefectiveReturnPartLine';
        };
    };
    findUnique<T extends VendorDefectiveReturnPartLineFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorDefectiveReturnPartLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorDefectiveReturnPartLineFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorDefectiveReturnPartLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorDefectiveReturnPartLineFindManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorDefectiveReturnPartLineCreateArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineCreateArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorDefectiveReturnPartLineCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorDefectiveReturnPartLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorDefectiveReturnPartLineDeleteArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorDefectiveReturnPartLineUpdateArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorDefectiveReturnPartLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorDefectiveReturnPartLineUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorDefectiveReturnPartLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorDefectiveReturnPartLineUpsertArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnPartLineUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorDefectiveReturnPartLineCountArgs>(args?: Prisma.Subset<T, VendorDefectiveReturnPartLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorDefectiveReturnPartLineCountAggregateOutputType> : number>;
    aggregate<T extends VendorDefectiveReturnPartLineAggregateArgs>(args: Prisma.Subset<T, VendorDefectiveReturnPartLineAggregateArgs>): Prisma.PrismaPromise<GetVendorDefectiveReturnPartLineAggregateType<T>>;
    groupBy<T extends VendorDefectiveReturnPartLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorDefectiveReturnPartLineGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorDefectiveReturnPartLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorDefectiveReturnPartLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorDefectiveReturnPartLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorDefectiveReturnPartLineFieldRefs;
}
export interface Prisma__VendorDefectiveReturnPartLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    return<T extends Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    partInventory<T extends Prisma.PartInventoryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PartInventoryDefaultArgs<ExtArgs>>): Prisma.Prisma__PartInventoryClient<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorDefectiveReturnPartLineFieldRefs {
    readonly id: Prisma.FieldRef<"VendorDefectiveReturnPartLine", 'String'>;
    readonly returnId: Prisma.FieldRef<"VendorDefectiveReturnPartLine", 'String'>;
    readonly partInventoryId: Prisma.FieldRef<"VendorDefectiveReturnPartLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"VendorDefectiveReturnPartLine", 'Int'>;
    readonly unitCost: Prisma.FieldRef<"VendorDefectiveReturnPartLine", 'Decimal'>;
    readonly totalCost: Prisma.FieldRef<"VendorDefectiveReturnPartLine", 'Decimal'>;
}
export type VendorDefectiveReturnPartLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
};
export type VendorDefectiveReturnPartLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
};
export type VendorDefectiveReturnPartLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput | Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnPartLineScalarFieldEnum | Prisma.VendorDefectiveReturnPartLineScalarFieldEnum[];
};
export type VendorDefectiveReturnPartLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput | Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnPartLineScalarFieldEnum | Prisma.VendorDefectiveReturnPartLineScalarFieldEnum[];
};
export type VendorDefectiveReturnPartLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput | Prisma.VendorDefectiveReturnPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnPartLineScalarFieldEnum | Prisma.VendorDefectiveReturnPartLineScalarFieldEnum[];
};
export type VendorDefectiveReturnPartLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateInput>;
};
export type VendorDefectiveReturnPartLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorDefectiveReturnPartLineCreateManyInput | Prisma.VendorDefectiveReturnPartLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnPartLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    data: Prisma.VendorDefectiveReturnPartLineCreateManyInput | Prisma.VendorDefectiveReturnPartLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VendorDefectiveReturnPartLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VendorDefectiveReturnPartLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateInput>;
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
};
export type VendorDefectiveReturnPartLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateManyMutationInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyInput>;
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    limit?: number;
};
export type VendorDefectiveReturnPartLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateManyMutationInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyInput>;
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    limit?: number;
    include?: Prisma.VendorDefectiveReturnPartLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VendorDefectiveReturnPartLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineCreateInput, Prisma.VendorDefectiveReturnPartLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnPartLineUpdateInput, Prisma.VendorDefectiveReturnPartLineUncheckedUpdateInput>;
};
export type VendorDefectiveReturnPartLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnPartLineWhereUniqueInput;
};
export type VendorDefectiveReturnPartLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
    limit?: number;
};
export type VendorDefectiveReturnPartLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnPartLineInclude<ExtArgs> | null;
};
