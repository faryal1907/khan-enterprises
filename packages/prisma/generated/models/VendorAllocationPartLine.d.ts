import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorAllocationPartLineModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorAllocationPartLinePayload>;
export type AggregateVendorAllocationPartLine = {
    _count: VendorAllocationPartLineCountAggregateOutputType | null;
    _avg: VendorAllocationPartLineAvgAggregateOutputType | null;
    _sum: VendorAllocationPartLineSumAggregateOutputType | null;
    _min: VendorAllocationPartLineMinAggregateOutputType | null;
    _max: VendorAllocationPartLineMaxAggregateOutputType | null;
};
export type VendorAllocationPartLineAvgAggregateOutputType = {
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorAllocationPartLineSumAggregateOutputType = {
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorAllocationPartLineMinAggregateOutputType = {
    id: string | null;
    allocationId: string | null;
    partId: string | null;
    branchId: string | null;
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorAllocationPartLineMaxAggregateOutputType = {
    id: string | null;
    allocationId: string | null;
    partId: string | null;
    branchId: string | null;
    quantity: number | null;
    unitCost: runtime.Decimal | null;
    totalCost: runtime.Decimal | null;
};
export type VendorAllocationPartLineCountAggregateOutputType = {
    id: number;
    allocationId: number;
    partId: number;
    branchId: number;
    quantity: number;
    unitCost: number;
    totalCost: number;
    _all: number;
};
export type VendorAllocationPartLineAvgAggregateInputType = {
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorAllocationPartLineSumAggregateInputType = {
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorAllocationPartLineMinAggregateInputType = {
    id?: true;
    allocationId?: true;
    partId?: true;
    branchId?: true;
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorAllocationPartLineMaxAggregateInputType = {
    id?: true;
    allocationId?: true;
    partId?: true;
    branchId?: true;
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
};
export type VendorAllocationPartLineCountAggregateInputType = {
    id?: true;
    allocationId?: true;
    partId?: true;
    branchId?: true;
    quantity?: true;
    unitCost?: true;
    totalCost?: true;
    _all?: true;
};
export type VendorAllocationPartLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationPartLineWhereInput;
    orderBy?: Prisma.VendorAllocationPartLineOrderByWithRelationInput | Prisma.VendorAllocationPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorAllocationPartLineCountAggregateInputType;
    _avg?: VendorAllocationPartLineAvgAggregateInputType;
    _sum?: VendorAllocationPartLineSumAggregateInputType;
    _min?: VendorAllocationPartLineMinAggregateInputType;
    _max?: VendorAllocationPartLineMaxAggregateInputType;
};
export type GetVendorAllocationPartLineAggregateType<T extends VendorAllocationPartLineAggregateArgs> = {
    [P in keyof T & keyof AggregateVendorAllocationPartLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendorAllocationPartLine[P]> : Prisma.GetScalarType<T[P], AggregateVendorAllocationPartLine[P]>;
};
export type VendorAllocationPartLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationPartLineWhereInput;
    orderBy?: Prisma.VendorAllocationPartLineOrderByWithAggregationInput | Prisma.VendorAllocationPartLineOrderByWithAggregationInput[];
    by: Prisma.VendorAllocationPartLineScalarFieldEnum[] | Prisma.VendorAllocationPartLineScalarFieldEnum;
    having?: Prisma.VendorAllocationPartLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorAllocationPartLineCountAggregateInputType | true;
    _avg?: VendorAllocationPartLineAvgAggregateInputType;
    _sum?: VendorAllocationPartLineSumAggregateInputType;
    _min?: VendorAllocationPartLineMinAggregateInputType;
    _max?: VendorAllocationPartLineMaxAggregateInputType;
};
export type VendorAllocationPartLineGroupByOutputType = {
    id: string;
    allocationId: string;
    partId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal;
    totalCost: runtime.Decimal;
    _count: VendorAllocationPartLineCountAggregateOutputType | null;
    _avg: VendorAllocationPartLineAvgAggregateOutputType | null;
    _sum: VendorAllocationPartLineSumAggregateOutputType | null;
    _min: VendorAllocationPartLineMinAggregateOutputType | null;
    _max: VendorAllocationPartLineMaxAggregateOutputType | null;
};
export type GetVendorAllocationPartLineGroupByPayload<T extends VendorAllocationPartLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorAllocationPartLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorAllocationPartLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorAllocationPartLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorAllocationPartLineGroupByOutputType[P]>;
}>>;
export type VendorAllocationPartLineWhereInput = {
    AND?: Prisma.VendorAllocationPartLineWhereInput | Prisma.VendorAllocationPartLineWhereInput[];
    OR?: Prisma.VendorAllocationPartLineWhereInput[];
    NOT?: Prisma.VendorAllocationPartLineWhereInput | Prisma.VendorAllocationPartLineWhereInput[];
    id?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    allocationId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    partId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    branchId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    quantity?: Prisma.IntFilter<"VendorAllocationPartLine"> | number;
    unitCost?: Prisma.DecimalFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation?: Prisma.XOR<Prisma.VendorAllocationScalarRelationFilter, Prisma.VendorAllocationWhereInput>;
    part?: Prisma.XOR<Prisma.PartScalarRelationFilter, Prisma.PartWhereInput>;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type VendorAllocationPartLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    allocationId?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    allocation?: Prisma.VendorAllocationOrderByWithRelationInput;
    part?: Prisma.PartOrderByWithRelationInput;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type VendorAllocationPartLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.VendorAllocationPartLineWhereInput | Prisma.VendorAllocationPartLineWhereInput[];
    OR?: Prisma.VendorAllocationPartLineWhereInput[];
    NOT?: Prisma.VendorAllocationPartLineWhereInput | Prisma.VendorAllocationPartLineWhereInput[];
    allocationId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    partId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    branchId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    quantity?: Prisma.IntFilter<"VendorAllocationPartLine"> | number;
    unitCost?: Prisma.DecimalFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation?: Prisma.XOR<Prisma.VendorAllocationScalarRelationFilter, Prisma.VendorAllocationWhereInput>;
    part?: Prisma.XOR<Prisma.PartScalarRelationFilter, Prisma.PartWhereInput>;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id">;
export type VendorAllocationPartLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    allocationId?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
    _count?: Prisma.VendorAllocationPartLineCountOrderByAggregateInput;
    _avg?: Prisma.VendorAllocationPartLineAvgOrderByAggregateInput;
    _max?: Prisma.VendorAllocationPartLineMaxOrderByAggregateInput;
    _min?: Prisma.VendorAllocationPartLineMinOrderByAggregateInput;
    _sum?: Prisma.VendorAllocationPartLineSumOrderByAggregateInput;
};
export type VendorAllocationPartLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorAllocationPartLineScalarWhereWithAggregatesInput | Prisma.VendorAllocationPartLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorAllocationPartLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorAllocationPartLineScalarWhereWithAggregatesInput | Prisma.VendorAllocationPartLineScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VendorAllocationPartLine"> | string;
    allocationId?: Prisma.StringWithAggregatesFilter<"VendorAllocationPartLine"> | string;
    partId?: Prisma.StringWithAggregatesFilter<"VendorAllocationPartLine"> | string;
    branchId?: Prisma.StringWithAggregatesFilter<"VendorAllocationPartLine"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"VendorAllocationPartLine"> | number;
    unitCost?: Prisma.DecimalWithAggregatesFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalWithAggregatesFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation: Prisma.VendorAllocationCreateNestedOneWithoutPartLinesInput;
    part: Prisma.PartCreateNestedOneWithoutAllocationLinesInput;
    branch: Prisma.BranchCreateNestedOneWithoutAllocationPartLinesInput;
};
export type VendorAllocationPartLineUncheckedCreateInput = {
    id?: string;
    allocationId: string;
    partId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation?: Prisma.VendorAllocationUpdateOneRequiredWithoutPartLinesNestedInput;
    part?: Prisma.PartUpdateOneRequiredWithoutAllocationLinesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutAllocationPartLinesNestedInput;
};
export type VendorAllocationPartLineUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateManyInput = {
    id?: string;
    allocationId: string;
    partId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineListRelationFilter = {
    every?: Prisma.VendorAllocationPartLineWhereInput;
    some?: Prisma.VendorAllocationPartLineWhereInput;
    none?: Prisma.VendorAllocationPartLineWhereInput;
};
export type VendorAllocationPartLineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VendorAllocationPartLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    allocationId?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorAllocationPartLineAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorAllocationPartLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    allocationId?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorAllocationPartLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    allocationId?: Prisma.SortOrder;
    partId?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorAllocationPartLineSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    totalCost?: Prisma.SortOrder;
};
export type VendorAllocationPartLineCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput> | Prisma.VendorAllocationPartLineCreateWithoutBranchInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyBranchInputEnvelope;
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
};
export type VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput> | Prisma.VendorAllocationPartLineCreateWithoutBranchInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyBranchInputEnvelope;
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
};
export type VendorAllocationPartLineUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput> | Prisma.VendorAllocationPartLineCreateWithoutBranchInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutBranchInput | Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyBranchInputEnvelope;
    set?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    delete?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    update?: Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutBranchInput | Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutBranchInput | Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
};
export type VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput> | Prisma.VendorAllocationPartLineCreateWithoutBranchInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutBranchInput | Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyBranchInputEnvelope;
    set?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    delete?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    update?: Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutBranchInput | Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutBranchInput | Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
};
export type VendorAllocationPartLineCreateNestedManyWithoutPartInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput> | Prisma.VendorAllocationPartLineCreateWithoutPartInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyPartInputEnvelope;
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
};
export type VendorAllocationPartLineUncheckedCreateNestedManyWithoutPartInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput> | Prisma.VendorAllocationPartLineCreateWithoutPartInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyPartInputEnvelope;
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
};
export type VendorAllocationPartLineUpdateManyWithoutPartNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput> | Prisma.VendorAllocationPartLineCreateWithoutPartInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput[];
    upsert?: Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutPartInput | Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutPartInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyPartInputEnvelope;
    set?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    delete?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    update?: Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutPartInput | Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutPartInput[];
    updateMany?: Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutPartInput | Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutPartInput[];
    deleteMany?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
};
export type VendorAllocationPartLineUncheckedUpdateManyWithoutPartNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput> | Prisma.VendorAllocationPartLineCreateWithoutPartInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutPartInput[];
    upsert?: Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutPartInput | Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutPartInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyPartInputEnvelope;
    set?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    delete?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    update?: Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutPartInput | Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutPartInput[];
    updateMany?: Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutPartInput | Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutPartInput[];
    deleteMany?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
};
export type VendorAllocationPartLineCreateNestedManyWithoutAllocationInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput> | Prisma.VendorAllocationPartLineCreateWithoutAllocationInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyAllocationInputEnvelope;
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
};
export type VendorAllocationPartLineUncheckedCreateNestedManyWithoutAllocationInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput> | Prisma.VendorAllocationPartLineCreateWithoutAllocationInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyAllocationInputEnvelope;
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
};
export type VendorAllocationPartLineUpdateManyWithoutAllocationNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput> | Prisma.VendorAllocationPartLineCreateWithoutAllocationInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput[];
    upsert?: Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutAllocationInput | Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutAllocationInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyAllocationInputEnvelope;
    set?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    delete?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    update?: Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutAllocationInput | Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutAllocationInput[];
    updateMany?: Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutAllocationInput | Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutAllocationInput[];
    deleteMany?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
};
export type VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput> | Prisma.VendorAllocationPartLineCreateWithoutAllocationInput[] | Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput[];
    connectOrCreate?: Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput | Prisma.VendorAllocationPartLineCreateOrConnectWithoutAllocationInput[];
    upsert?: Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutAllocationInput | Prisma.VendorAllocationPartLineUpsertWithWhereUniqueWithoutAllocationInput[];
    createMany?: Prisma.VendorAllocationPartLineCreateManyAllocationInputEnvelope;
    set?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    delete?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    connect?: Prisma.VendorAllocationPartLineWhereUniqueInput | Prisma.VendorAllocationPartLineWhereUniqueInput[];
    update?: Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutAllocationInput | Prisma.VendorAllocationPartLineUpdateWithWhereUniqueWithoutAllocationInput[];
    updateMany?: Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutAllocationInput | Prisma.VendorAllocationPartLineUpdateManyWithWhereWithoutAllocationInput[];
    deleteMany?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
};
export type VendorAllocationPartLineCreateWithoutBranchInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation: Prisma.VendorAllocationCreateNestedOneWithoutPartLinesInput;
    part: Prisma.PartCreateNestedOneWithoutAllocationLinesInput;
};
export type VendorAllocationPartLineUncheckedCreateWithoutBranchInput = {
    id?: string;
    allocationId: string;
    partId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateOrConnectWithoutBranchInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput>;
};
export type VendorAllocationPartLineCreateManyBranchInputEnvelope = {
    data: Prisma.VendorAllocationPartLineCreateManyBranchInput | Prisma.VendorAllocationPartLineCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationPartLineUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutBranchInput>;
};
export type VendorAllocationPartLineUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateWithoutBranchInput, Prisma.VendorAllocationPartLineUncheckedUpdateWithoutBranchInput>;
};
export type VendorAllocationPartLineUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.VendorAllocationPartLineScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateManyMutationInput, Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchInput>;
};
export type VendorAllocationPartLineScalarWhereInput = {
    AND?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
    OR?: Prisma.VendorAllocationPartLineScalarWhereInput[];
    NOT?: Prisma.VendorAllocationPartLineScalarWhereInput | Prisma.VendorAllocationPartLineScalarWhereInput[];
    id?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    allocationId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    partId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    branchId?: Prisma.StringFilter<"VendorAllocationPartLine"> | string;
    quantity?: Prisma.IntFilter<"VendorAllocationPartLine"> | number;
    unitCost?: Prisma.DecimalFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFilter<"VendorAllocationPartLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateWithoutPartInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation: Prisma.VendorAllocationCreateNestedOneWithoutPartLinesInput;
    branch: Prisma.BranchCreateNestedOneWithoutAllocationPartLinesInput;
};
export type VendorAllocationPartLineUncheckedCreateWithoutPartInput = {
    id?: string;
    allocationId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateOrConnectWithoutPartInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput>;
};
export type VendorAllocationPartLineCreateManyPartInputEnvelope = {
    data: Prisma.VendorAllocationPartLineCreateManyPartInput | Prisma.VendorAllocationPartLineCreateManyPartInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationPartLineUpsertWithWhereUniqueWithoutPartInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedUpdateWithoutPartInput>;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutPartInput>;
};
export type VendorAllocationPartLineUpdateWithWhereUniqueWithoutPartInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateWithoutPartInput, Prisma.VendorAllocationPartLineUncheckedUpdateWithoutPartInput>;
};
export type VendorAllocationPartLineUpdateManyWithWhereWithoutPartInput = {
    where: Prisma.VendorAllocationPartLineScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateManyMutationInput, Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutPartInput>;
};
export type VendorAllocationPartLineCreateWithoutAllocationInput = {
    id?: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    part: Prisma.PartCreateNestedOneWithoutAllocationLinesInput;
    branch: Prisma.BranchCreateNestedOneWithoutAllocationPartLinesInput;
};
export type VendorAllocationPartLineUncheckedCreateWithoutAllocationInput = {
    id?: string;
    partId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateOrConnectWithoutAllocationInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput>;
};
export type VendorAllocationPartLineCreateManyAllocationInputEnvelope = {
    data: Prisma.VendorAllocationPartLineCreateManyAllocationInput | Prisma.VendorAllocationPartLineCreateManyAllocationInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationPartLineUpsertWithWhereUniqueWithoutAllocationInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedUpdateWithoutAllocationInput>;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedCreateWithoutAllocationInput>;
};
export type VendorAllocationPartLineUpdateWithWhereUniqueWithoutAllocationInput = {
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateWithoutAllocationInput, Prisma.VendorAllocationPartLineUncheckedUpdateWithoutAllocationInput>;
};
export type VendorAllocationPartLineUpdateManyWithWhereWithoutAllocationInput = {
    where: Prisma.VendorAllocationPartLineScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateManyMutationInput, Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationInput>;
};
export type VendorAllocationPartLineCreateManyBranchInput = {
    id?: string;
    allocationId: string;
    partId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation?: Prisma.VendorAllocationUpdateOneRequiredWithoutPartLinesNestedInput;
    part?: Prisma.PartUpdateOneRequiredWithoutAllocationLinesNestedInput;
};
export type VendorAllocationPartLineUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateManyPartInput = {
    id?: string;
    allocationId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUpdateWithoutPartInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    allocation?: Prisma.VendorAllocationUpdateOneRequiredWithoutPartLinesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutAllocationPartLinesNestedInput;
};
export type VendorAllocationPartLineUncheckedUpdateWithoutPartInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUncheckedUpdateManyWithoutPartInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineCreateManyAllocationInput = {
    id?: string;
    partId: string;
    branchId: string;
    quantity: number;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUpdateWithoutAllocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    part?: Prisma.PartUpdateOneRequiredWithoutAllocationLinesNestedInput;
    branch?: Prisma.BranchUpdateOneRequiredWithoutAllocationPartLinesNestedInput;
};
export type VendorAllocationPartLineUncheckedUpdateWithoutAllocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partId?: Prisma.StringFieldUpdateOperationsInput | string;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorAllocationPartLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    allocationId?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
    allocation?: boolean | Prisma.VendorAllocationDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorAllocationPartLine"]>;
export type VendorAllocationPartLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    allocationId?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
    allocation?: boolean | Prisma.VendorAllocationDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorAllocationPartLine"]>;
export type VendorAllocationPartLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    allocationId?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
    allocation?: boolean | Prisma.VendorAllocationDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorAllocationPartLine"]>;
export type VendorAllocationPartLineSelectScalar = {
    id?: boolean;
    allocationId?: boolean;
    partId?: boolean;
    branchId?: boolean;
    quantity?: boolean;
    unitCost?: boolean;
    totalCost?: boolean;
};
export type VendorAllocationPartLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "allocationId" | "partId" | "branchId" | "quantity" | "unitCost" | "totalCost", ExtArgs["result"]["vendorAllocationPartLine"]>;
export type VendorAllocationPartLineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    allocation?: boolean | Prisma.VendorAllocationDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type VendorAllocationPartLineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    allocation?: boolean | Prisma.VendorAllocationDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type VendorAllocationPartLineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    allocation?: boolean | Prisma.VendorAllocationDefaultArgs<ExtArgs>;
    part?: boolean | Prisma.PartDefaultArgs<ExtArgs>;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $VendorAllocationPartLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VendorAllocationPartLine";
    objects: {
        allocation: Prisma.$VendorAllocationPayload<ExtArgs>;
        part: Prisma.$PartPayload<ExtArgs>;
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        allocationId: string;
        partId: string;
        branchId: string;
        quantity: number;
        unitCost: runtime.Decimal;
        totalCost: runtime.Decimal;
    }, ExtArgs["result"]["vendorAllocationPartLine"]>;
    composites: {};
};
export type VendorAllocationPartLineGetPayload<S extends boolean | null | undefined | VendorAllocationPartLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload, S>;
export type VendorAllocationPartLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorAllocationPartLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorAllocationPartLineCountAggregateInputType | true;
};
export interface VendorAllocationPartLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VendorAllocationPartLine'];
        meta: {
            name: 'VendorAllocationPartLine';
        };
    };
    findUnique<T extends VendorAllocationPartLineFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorAllocationPartLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorAllocationPartLineFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorAllocationPartLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorAllocationPartLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorAllocationPartLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorAllocationPartLineFindManyArgs>(args?: Prisma.SelectSubset<T, VendorAllocationPartLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorAllocationPartLineCreateArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineCreateArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorAllocationPartLineCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorAllocationPartLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorAllocationPartLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorAllocationPartLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorAllocationPartLineDeleteArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorAllocationPartLineUpdateArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorAllocationPartLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorAllocationPartLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorAllocationPartLineUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorAllocationPartLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorAllocationPartLineUpsertArgs>(args: Prisma.SelectSubset<T, VendorAllocationPartLineUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationPartLineClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorAllocationPartLineCountArgs>(args?: Prisma.Subset<T, VendorAllocationPartLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorAllocationPartLineCountAggregateOutputType> : number>;
    aggregate<T extends VendorAllocationPartLineAggregateArgs>(args: Prisma.Subset<T, VendorAllocationPartLineAggregateArgs>): Prisma.PrismaPromise<GetVendorAllocationPartLineAggregateType<T>>;
    groupBy<T extends VendorAllocationPartLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorAllocationPartLineGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorAllocationPartLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorAllocationPartLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorAllocationPartLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorAllocationPartLineFieldRefs;
}
export interface Prisma__VendorAllocationPartLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    allocation<T extends Prisma.VendorAllocationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorAllocationDefaultArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    part<T extends Prisma.PartDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PartDefaultArgs<ExtArgs>>): Prisma.Prisma__PartClient<runtime.Types.Result.GetResult<Prisma.$PartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    branch<T extends Prisma.BranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BranchDefaultArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorAllocationPartLineFieldRefs {
    readonly id: Prisma.FieldRef<"VendorAllocationPartLine", 'String'>;
    readonly allocationId: Prisma.FieldRef<"VendorAllocationPartLine", 'String'>;
    readonly partId: Prisma.FieldRef<"VendorAllocationPartLine", 'String'>;
    readonly branchId: Prisma.FieldRef<"VendorAllocationPartLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"VendorAllocationPartLine", 'Int'>;
    readonly unitCost: Prisma.FieldRef<"VendorAllocationPartLine", 'Decimal'>;
    readonly totalCost: Prisma.FieldRef<"VendorAllocationPartLine", 'Decimal'>;
}
export type VendorAllocationPartLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
};
export type VendorAllocationPartLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
};
export type VendorAllocationPartLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationPartLineWhereInput;
    orderBy?: Prisma.VendorAllocationPartLineOrderByWithRelationInput | Prisma.VendorAllocationPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationPartLineScalarFieldEnum | Prisma.VendorAllocationPartLineScalarFieldEnum[];
};
export type VendorAllocationPartLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationPartLineWhereInput;
    orderBy?: Prisma.VendorAllocationPartLineOrderByWithRelationInput | Prisma.VendorAllocationPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationPartLineScalarFieldEnum | Prisma.VendorAllocationPartLineScalarFieldEnum[];
};
export type VendorAllocationPartLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationPartLineWhereInput;
    orderBy?: Prisma.VendorAllocationPartLineOrderByWithRelationInput | Prisma.VendorAllocationPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationPartLineScalarFieldEnum | Prisma.VendorAllocationPartLineScalarFieldEnum[];
};
export type VendorAllocationPartLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineCreateInput, Prisma.VendorAllocationPartLineUncheckedCreateInput>;
};
export type VendorAllocationPartLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorAllocationPartLineCreateManyInput | Prisma.VendorAllocationPartLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationPartLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    data: Prisma.VendorAllocationPartLineCreateManyInput | Prisma.VendorAllocationPartLineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VendorAllocationPartLineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VendorAllocationPartLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateInput, Prisma.VendorAllocationPartLineUncheckedUpdateInput>;
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
};
export type VendorAllocationPartLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateManyMutationInput, Prisma.VendorAllocationPartLineUncheckedUpdateManyInput>;
    where?: Prisma.VendorAllocationPartLineWhereInput;
    limit?: number;
};
export type VendorAllocationPartLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateManyMutationInput, Prisma.VendorAllocationPartLineUncheckedUpdateManyInput>;
    where?: Prisma.VendorAllocationPartLineWhereInput;
    limit?: number;
    include?: Prisma.VendorAllocationPartLineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VendorAllocationPartLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationPartLineCreateInput, Prisma.VendorAllocationPartLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorAllocationPartLineUpdateInput, Prisma.VendorAllocationPartLineUncheckedUpdateInput>;
};
export type VendorAllocationPartLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationPartLineWhereUniqueInput;
};
export type VendorAllocationPartLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationPartLineWhereInput;
    limit?: number;
};
export type VendorAllocationPartLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
};
