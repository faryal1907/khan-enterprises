import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorDefectiveReturnBikeModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorDefectiveReturnBikePayload>;
export type AggregateVendorDefectiveReturnBike = {
    _count: VendorDefectiveReturnBikeCountAggregateOutputType | null;
    _avg: VendorDefectiveReturnBikeAvgAggregateOutputType | null;
    _sum: VendorDefectiveReturnBikeSumAggregateOutputType | null;
    _min: VendorDefectiveReturnBikeMinAggregateOutputType | null;
    _max: VendorDefectiveReturnBikeMaxAggregateOutputType | null;
};
export type VendorDefectiveReturnBikeAvgAggregateOutputType = {
    unitCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnBikeSumAggregateOutputType = {
    unitCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnBikeMinAggregateOutputType = {
    id: string | null;
    returnId: string | null;
    chassisNumber: string | null;
    modelBrand: string | null;
    modelName: string | null;
    unitCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnBikeMaxAggregateOutputType = {
    id: string | null;
    returnId: string | null;
    chassisNumber: string | null;
    modelBrand: string | null;
    modelName: string | null;
    unitCost: runtime.Decimal | null;
};
export type VendorDefectiveReturnBikeCountAggregateOutputType = {
    id: number;
    returnId: number;
    chassisNumber: number;
    modelBrand: number;
    modelName: number;
    unitCost: number;
    _all: number;
};
export type VendorDefectiveReturnBikeAvgAggregateInputType = {
    unitCost?: true;
};
export type VendorDefectiveReturnBikeSumAggregateInputType = {
    unitCost?: true;
};
export type VendorDefectiveReturnBikeMinAggregateInputType = {
    id?: true;
    returnId?: true;
    chassisNumber?: true;
    modelBrand?: true;
    modelName?: true;
    unitCost?: true;
};
export type VendorDefectiveReturnBikeMaxAggregateInputType = {
    id?: true;
    returnId?: true;
    chassisNumber?: true;
    modelBrand?: true;
    modelName?: true;
    unitCost?: true;
};
export type VendorDefectiveReturnBikeCountAggregateInputType = {
    id?: true;
    returnId?: true;
    chassisNumber?: true;
    modelBrand?: true;
    modelName?: true;
    unitCost?: true;
    _all?: true;
};
export type VendorDefectiveReturnBikeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput | Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorDefectiveReturnBikeCountAggregateInputType;
    _avg?: VendorDefectiveReturnBikeAvgAggregateInputType;
    _sum?: VendorDefectiveReturnBikeSumAggregateInputType;
    _min?: VendorDefectiveReturnBikeMinAggregateInputType;
    _max?: VendorDefectiveReturnBikeMaxAggregateInputType;
};
export type GetVendorDefectiveReturnBikeAggregateType<T extends VendorDefectiveReturnBikeAggregateArgs> = {
    [P in keyof T & keyof AggregateVendorDefectiveReturnBike]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendorDefectiveReturnBike[P]> : Prisma.GetScalarType<T[P], AggregateVendorDefectiveReturnBike[P]>;
};
export type VendorDefectiveReturnBikeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnBikeOrderByWithAggregationInput | Prisma.VendorDefectiveReturnBikeOrderByWithAggregationInput[];
    by: Prisma.VendorDefectiveReturnBikeScalarFieldEnum[] | Prisma.VendorDefectiveReturnBikeScalarFieldEnum;
    having?: Prisma.VendorDefectiveReturnBikeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorDefectiveReturnBikeCountAggregateInputType | true;
    _avg?: VendorDefectiveReturnBikeAvgAggregateInputType;
    _sum?: VendorDefectiveReturnBikeSumAggregateInputType;
    _min?: VendorDefectiveReturnBikeMinAggregateInputType;
    _max?: VendorDefectiveReturnBikeMaxAggregateInputType;
};
export type VendorDefectiveReturnBikeGroupByOutputType = {
    id: string;
    returnId: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal;
    _count: VendorDefectiveReturnBikeCountAggregateOutputType | null;
    _avg: VendorDefectiveReturnBikeAvgAggregateOutputType | null;
    _sum: VendorDefectiveReturnBikeSumAggregateOutputType | null;
    _min: VendorDefectiveReturnBikeMinAggregateOutputType | null;
    _max: VendorDefectiveReturnBikeMaxAggregateOutputType | null;
};
export type GetVendorDefectiveReturnBikeGroupByPayload<T extends VendorDefectiveReturnBikeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorDefectiveReturnBikeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorDefectiveReturnBikeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorDefectiveReturnBikeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorDefectiveReturnBikeGroupByOutputType[P]>;
}>>;
export type VendorDefectiveReturnBikeWhereInput = {
    AND?: Prisma.VendorDefectiveReturnBikeWhereInput | Prisma.VendorDefectiveReturnBikeWhereInput[];
    OR?: Prisma.VendorDefectiveReturnBikeWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnBikeWhereInput | Prisma.VendorDefectiveReturnBikeWhereInput[];
    id?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    returnId?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    chassisNumber?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    modelBrand?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    modelName?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    unitCost?: Prisma.DecimalFilter<"VendorDefectiveReturnBike"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.XOR<Prisma.VendorDefectiveReturnScalarRelationFilter, Prisma.VendorDefectiveReturnWhereInput>;
};
export type VendorDefectiveReturnBikeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    chassisNumber?: Prisma.SortOrder;
    modelBrand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    return?: Prisma.VendorDefectiveReturnOrderByWithRelationInput;
};
export type VendorDefectiveReturnBikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.VendorDefectiveReturnBikeWhereInput | Prisma.VendorDefectiveReturnBikeWhereInput[];
    OR?: Prisma.VendorDefectiveReturnBikeWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnBikeWhereInput | Prisma.VendorDefectiveReturnBikeWhereInput[];
    returnId?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    chassisNumber?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    modelBrand?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    modelName?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    unitCost?: Prisma.DecimalFilter<"VendorDefectiveReturnBike"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.XOR<Prisma.VendorDefectiveReturnScalarRelationFilter, Prisma.VendorDefectiveReturnWhereInput>;
}, "id">;
export type VendorDefectiveReturnBikeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    chassisNumber?: Prisma.SortOrder;
    modelBrand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
    _count?: Prisma.VendorDefectiveReturnBikeCountOrderByAggregateInput;
    _avg?: Prisma.VendorDefectiveReturnBikeAvgOrderByAggregateInput;
    _max?: Prisma.VendorDefectiveReturnBikeMaxOrderByAggregateInput;
    _min?: Prisma.VendorDefectiveReturnBikeMinOrderByAggregateInput;
    _sum?: Prisma.VendorDefectiveReturnBikeSumOrderByAggregateInput;
};
export type VendorDefectiveReturnBikeScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorDefectiveReturnBikeScalarWhereWithAggregatesInput | Prisma.VendorDefectiveReturnBikeScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorDefectiveReturnBikeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorDefectiveReturnBikeScalarWhereWithAggregatesInput | Prisma.VendorDefectiveReturnBikeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnBike"> | string;
    returnId?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnBike"> | string;
    chassisNumber?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnBike"> | string;
    modelBrand?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnBike"> | string;
    modelName?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturnBike"> | string;
    unitCost?: Prisma.DecimalWithAggregatesFilter<"VendorDefectiveReturnBike"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeCreateInput = {
    id?: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
    return: Prisma.VendorDefectiveReturnCreateNestedOneWithoutBikesInput;
};
export type VendorDefectiveReturnBikeUncheckedCreateInput = {
    id?: string;
    returnId: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    return?: Prisma.VendorDefectiveReturnUpdateOneRequiredWithoutBikesNestedInput;
};
export type VendorDefectiveReturnBikeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    returnId?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeCreateManyInput = {
    id?: string;
    returnId: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    returnId?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeListRelationFilter = {
    every?: Prisma.VendorDefectiveReturnBikeWhereInput;
    some?: Prisma.VendorDefectiveReturnBikeWhereInput;
    none?: Prisma.VendorDefectiveReturnBikeWhereInput;
};
export type VendorDefectiveReturnBikeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VendorDefectiveReturnBikeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    chassisNumber?: Prisma.SortOrder;
    modelBrand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnBikeAvgOrderByAggregateInput = {
    unitCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnBikeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    chassisNumber?: Prisma.SortOrder;
    modelBrand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnBikeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    returnId?: Prisma.SortOrder;
    chassisNumber?: Prisma.SortOrder;
    modelBrand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    unitCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnBikeSumOrderByAggregateInput = {
    unitCost?: Prisma.SortOrder;
};
export type VendorDefectiveReturnBikeCreateNestedManyWithoutReturnInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnBikeCreateManyReturnInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
};
export type VendorDefectiveReturnBikeUncheckedCreateNestedManyWithoutReturnInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnBikeCreateManyReturnInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
};
export type VendorDefectiveReturnBikeUpdateManyWithoutReturnNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput[];
    upsert?: Prisma.VendorDefectiveReturnBikeUpsertWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnBikeUpsertWithWhereUniqueWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnBikeCreateManyReturnInputEnvelope;
    set?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnBikeUpdateWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnBikeUpdateWithWhereUniqueWithoutReturnInput[];
    updateMany?: Prisma.VendorDefectiveReturnBikeUpdateManyWithWhereWithoutReturnInput | Prisma.VendorDefectiveReturnBikeUpdateManyWithWhereWithoutReturnInput[];
    deleteMany?: Prisma.VendorDefectiveReturnBikeScalarWhereInput | Prisma.VendorDefectiveReturnBikeScalarWhereInput[];
};
export type VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput> | Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput[] | Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput | Prisma.VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput[];
    upsert?: Prisma.VendorDefectiveReturnBikeUpsertWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnBikeUpsertWithWhereUniqueWithoutReturnInput[];
    createMany?: Prisma.VendorDefectiveReturnBikeCreateManyReturnInputEnvelope;
    set?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput | Prisma.VendorDefectiveReturnBikeWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnBikeUpdateWithWhereUniqueWithoutReturnInput | Prisma.VendorDefectiveReturnBikeUpdateWithWhereUniqueWithoutReturnInput[];
    updateMany?: Prisma.VendorDefectiveReturnBikeUpdateManyWithWhereWithoutReturnInput | Prisma.VendorDefectiveReturnBikeUpdateManyWithWhereWithoutReturnInput[];
    deleteMany?: Prisma.VendorDefectiveReturnBikeScalarWhereInput | Prisma.VendorDefectiveReturnBikeScalarWhereInput[];
};
export type VendorDefectiveReturnBikeCreateWithoutReturnInput = {
    id?: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput = {
    id?: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeCreateOrConnectWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput>;
};
export type VendorDefectiveReturnBikeCreateManyReturnInputEnvelope = {
    data: Prisma.VendorDefectiveReturnBikeCreateManyReturnInput | Prisma.VendorDefectiveReturnBikeCreateManyReturnInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnBikeUpsertWithWhereUniqueWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateWithoutReturnInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateWithoutReturnInput>;
};
export type VendorDefectiveReturnBikeUpdateWithWhereUniqueWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateWithoutReturnInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateWithoutReturnInput>;
};
export type VendorDefectiveReturnBikeUpdateManyWithWhereWithoutReturnInput = {
    where: Prisma.VendorDefectiveReturnBikeScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateManyMutationInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnInput>;
};
export type VendorDefectiveReturnBikeScalarWhereInput = {
    AND?: Prisma.VendorDefectiveReturnBikeScalarWhereInput | Prisma.VendorDefectiveReturnBikeScalarWhereInput[];
    OR?: Prisma.VendorDefectiveReturnBikeScalarWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnBikeScalarWhereInput | Prisma.VendorDefectiveReturnBikeScalarWhereInput[];
    id?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    returnId?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    chassisNumber?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    modelBrand?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    modelName?: Prisma.StringFilter<"VendorDefectiveReturnBike"> | string;
    unitCost?: Prisma.DecimalFilter<"VendorDefectiveReturnBike"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeCreateManyReturnInput = {
    id?: string;
    chassisNumber: string;
    modelBrand: string;
    modelName: string;
    unitCost: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUpdateWithoutReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUncheckedUpdateWithoutReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chassisNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    modelBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    unitCost?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type VendorDefectiveReturnBikeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    returnId?: boolean;
    chassisNumber?: boolean;
    modelBrand?: boolean;
    modelName?: boolean;
    unitCost?: boolean;
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturnBike"]>;
export type VendorDefectiveReturnBikeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    returnId?: boolean;
    chassisNumber?: boolean;
    modelBrand?: boolean;
    modelName?: boolean;
    unitCost?: boolean;
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturnBike"]>;
export type VendorDefectiveReturnBikeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    returnId?: boolean;
    chassisNumber?: boolean;
    modelBrand?: boolean;
    modelName?: boolean;
    unitCost?: boolean;
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturnBike"]>;
export type VendorDefectiveReturnBikeSelectScalar = {
    id?: boolean;
    returnId?: boolean;
    chassisNumber?: boolean;
    modelBrand?: boolean;
    modelName?: boolean;
    unitCost?: boolean;
};
export type VendorDefectiveReturnBikeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "returnId" | "chassisNumber" | "modelBrand" | "modelName" | "unitCost", ExtArgs["result"]["vendorDefectiveReturnBike"]>;
export type VendorDefectiveReturnBikeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
};
export type VendorDefectiveReturnBikeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
};
export type VendorDefectiveReturnBikeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    return?: boolean | Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>;
};
export type $VendorDefectiveReturnBikePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VendorDefectiveReturnBike";
    objects: {
        return: Prisma.$VendorDefectiveReturnPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        returnId: string;
        chassisNumber: string;
        modelBrand: string;
        modelName: string;
        unitCost: runtime.Decimal;
    }, ExtArgs["result"]["vendorDefectiveReturnBike"]>;
    composites: {};
};
export type VendorDefectiveReturnBikeGetPayload<S extends boolean | null | undefined | VendorDefectiveReturnBikeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload, S>;
export type VendorDefectiveReturnBikeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorDefectiveReturnBikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorDefectiveReturnBikeCountAggregateInputType | true;
};
export interface VendorDefectiveReturnBikeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VendorDefectiveReturnBike'];
        meta: {
            name: 'VendorDefectiveReturnBike';
        };
    };
    findUnique<T extends VendorDefectiveReturnBikeFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorDefectiveReturnBikeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorDefectiveReturnBikeFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnBikeFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorDefectiveReturnBikeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnBikeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorDefectiveReturnBikeFindManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnBikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorDefectiveReturnBikeCreateArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeCreateArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorDefectiveReturnBikeCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnBikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorDefectiveReturnBikeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnBikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorDefectiveReturnBikeDeleteArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorDefectiveReturnBikeUpdateArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorDefectiveReturnBikeDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnBikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorDefectiveReturnBikeUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorDefectiveReturnBikeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorDefectiveReturnBikeUpsertArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnBikeUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnBikeClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorDefectiveReturnBikeCountArgs>(args?: Prisma.Subset<T, VendorDefectiveReturnBikeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorDefectiveReturnBikeCountAggregateOutputType> : number>;
    aggregate<T extends VendorDefectiveReturnBikeAggregateArgs>(args: Prisma.Subset<T, VendorDefectiveReturnBikeAggregateArgs>): Prisma.PrismaPromise<GetVendorDefectiveReturnBikeAggregateType<T>>;
    groupBy<T extends VendorDefectiveReturnBikeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorDefectiveReturnBikeGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorDefectiveReturnBikeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorDefectiveReturnBikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorDefectiveReturnBikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorDefectiveReturnBikeFieldRefs;
}
export interface Prisma__VendorDefectiveReturnBikeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    return<T extends Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefectiveReturnDefaultArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorDefectiveReturnBikeFieldRefs {
    readonly id: Prisma.FieldRef<"VendorDefectiveReturnBike", 'String'>;
    readonly returnId: Prisma.FieldRef<"VendorDefectiveReturnBike", 'String'>;
    readonly chassisNumber: Prisma.FieldRef<"VendorDefectiveReturnBike", 'String'>;
    readonly modelBrand: Prisma.FieldRef<"VendorDefectiveReturnBike", 'String'>;
    readonly modelName: Prisma.FieldRef<"VendorDefectiveReturnBike", 'String'>;
    readonly unitCost: Prisma.FieldRef<"VendorDefectiveReturnBike", 'Decimal'>;
}
export type VendorDefectiveReturnBikeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
};
export type VendorDefectiveReturnBikeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
};
export type VendorDefectiveReturnBikeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput | Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnBikeScalarFieldEnum | Prisma.VendorDefectiveReturnBikeScalarFieldEnum[];
};
export type VendorDefectiveReturnBikeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput | Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnBikeScalarFieldEnum | Prisma.VendorDefectiveReturnBikeScalarFieldEnum[];
};
export type VendorDefectiveReturnBikeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput | Prisma.VendorDefectiveReturnBikeOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnBikeScalarFieldEnum | Prisma.VendorDefectiveReturnBikeScalarFieldEnum[];
};
export type VendorDefectiveReturnBikeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateInput>;
};
export type VendorDefectiveReturnBikeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorDefectiveReturnBikeCreateManyInput | Prisma.VendorDefectiveReturnBikeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnBikeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    data: Prisma.VendorDefectiveReturnBikeCreateManyInput | Prisma.VendorDefectiveReturnBikeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VendorDefectiveReturnBikeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VendorDefectiveReturnBikeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateInput>;
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
};
export type VendorDefectiveReturnBikeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateManyMutationInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyInput>;
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    limit?: number;
};
export type VendorDefectiveReturnBikeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateManyMutationInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyInput>;
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    limit?: number;
    include?: Prisma.VendorDefectiveReturnBikeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VendorDefectiveReturnBikeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnBikeCreateInput, Prisma.VendorDefectiveReturnBikeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnBikeUpdateInput, Prisma.VendorDefectiveReturnBikeUncheckedUpdateInput>;
};
export type VendorDefectiveReturnBikeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnBikeWhereUniqueInput;
};
export type VendorDefectiveReturnBikeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
    limit?: number;
};
export type VendorDefectiveReturnBikeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnBikeSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnBikeOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnBikeInclude<ExtArgs> | null;
};
