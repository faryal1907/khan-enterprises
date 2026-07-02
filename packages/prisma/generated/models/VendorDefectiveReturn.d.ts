import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorDefectiveReturnModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorDefectiveReturnPayload>;
export type AggregateVendorDefectiveReturn = {
    _count: VendorDefectiveReturnCountAggregateOutputType | null;
    _avg: VendorDefectiveReturnAvgAggregateOutputType | null;
    _sum: VendorDefectiveReturnSumAggregateOutputType | null;
    _min: VendorDefectiveReturnMinAggregateOutputType | null;
    _max: VendorDefectiveReturnMaxAggregateOutputType | null;
};
export type VendorDefectiveReturnAvgAggregateOutputType = {
    totalAmount: runtime.Decimal | null;
};
export type VendorDefectiveReturnSumAggregateOutputType = {
    totalAmount: runtime.Decimal | null;
};
export type VendorDefectiveReturnMinAggregateOutputType = {
    id: string | null;
    vendorId: string | null;
    totalAmount: runtime.Decimal | null;
    date: Date | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorDefectiveReturnMaxAggregateOutputType = {
    id: string | null;
    vendorId: string | null;
    totalAmount: runtime.Decimal | null;
    date: Date | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorDefectiveReturnCountAggregateOutputType = {
    id: number;
    vendorId: number;
    totalAmount: number;
    date: number;
    notes: number;
    journalEntryId: number;
    recordedById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type VendorDefectiveReturnAvgAggregateInputType = {
    totalAmount?: true;
};
export type VendorDefectiveReturnSumAggregateInputType = {
    totalAmount?: true;
};
export type VendorDefectiveReturnMinAggregateInputType = {
    id?: true;
    vendorId?: true;
    totalAmount?: true;
    date?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorDefectiveReturnMaxAggregateInputType = {
    id?: true;
    vendorId?: true;
    totalAmount?: true;
    date?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorDefectiveReturnCountAggregateInputType = {
    id?: true;
    vendorId?: true;
    totalAmount?: true;
    date?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type VendorDefectiveReturnAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnOrderByWithRelationInput | Prisma.VendorDefectiveReturnOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorDefectiveReturnCountAggregateInputType;
    _avg?: VendorDefectiveReturnAvgAggregateInputType;
    _sum?: VendorDefectiveReturnSumAggregateInputType;
    _min?: VendorDefectiveReturnMinAggregateInputType;
    _max?: VendorDefectiveReturnMaxAggregateInputType;
};
export type GetVendorDefectiveReturnAggregateType<T extends VendorDefectiveReturnAggregateArgs> = {
    [P in keyof T & keyof AggregateVendorDefectiveReturn]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendorDefectiveReturn[P]> : Prisma.GetScalarType<T[P], AggregateVendorDefectiveReturn[P]>;
};
export type VendorDefectiveReturnGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnOrderByWithAggregationInput | Prisma.VendorDefectiveReturnOrderByWithAggregationInput[];
    by: Prisma.VendorDefectiveReturnScalarFieldEnum[] | Prisma.VendorDefectiveReturnScalarFieldEnum;
    having?: Prisma.VendorDefectiveReturnScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorDefectiveReturnCountAggregateInputType | true;
    _avg?: VendorDefectiveReturnAvgAggregateInputType;
    _sum?: VendorDefectiveReturnSumAggregateInputType;
    _min?: VendorDefectiveReturnMinAggregateInputType;
    _max?: VendorDefectiveReturnMaxAggregateInputType;
};
export type VendorDefectiveReturnGroupByOutputType = {
    id: string;
    vendorId: string;
    totalAmount: runtime.Decimal;
    date: Date;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorDefectiveReturnCountAggregateOutputType | null;
    _avg: VendorDefectiveReturnAvgAggregateOutputType | null;
    _sum: VendorDefectiveReturnSumAggregateOutputType | null;
    _min: VendorDefectiveReturnMinAggregateOutputType | null;
    _max: VendorDefectiveReturnMaxAggregateOutputType | null;
};
export type GetVendorDefectiveReturnGroupByPayload<T extends VendorDefectiveReturnGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorDefectiveReturnGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorDefectiveReturnGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorDefectiveReturnGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorDefectiveReturnGroupByOutputType[P]>;
}>>;
export type VendorDefectiveReturnWhereInput = {
    AND?: Prisma.VendorDefectiveReturnWhereInput | Prisma.VendorDefectiveReturnWhereInput[];
    OR?: Prisma.VendorDefectiveReturnWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnWhereInput | Prisma.VendorDefectiveReturnWhereInput[];
    id?: Prisma.StringFilter<"VendorDefectiveReturn"> | string;
    vendorId?: Prisma.StringFilter<"VendorDefectiveReturn"> | string;
    totalAmount?: Prisma.DecimalFilter<"VendorDefectiveReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    vendor?: Prisma.XOR<Prisma.VendorScalarRelationFilter, Prisma.VendorWhereInput>;
    bikes?: Prisma.VendorDefectiveReturnBikeListRelationFilter;
    partLines?: Prisma.VendorDefectiveReturnPartLineListRelationFilter;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type VendorDefectiveReturnOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    vendor?: Prisma.VendorOrderByWithRelationInput;
    bikes?: Prisma.VendorDefectiveReturnBikeOrderByRelationAggregateInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineOrderByRelationAggregateInput;
    journalEntry?: Prisma.JournalEntryOrderByWithRelationInput;
    recordedBy?: Prisma.UserOrderByWithRelationInput;
};
export type VendorDefectiveReturnWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    journalEntryId?: string;
    AND?: Prisma.VendorDefectiveReturnWhereInput | Prisma.VendorDefectiveReturnWhereInput[];
    OR?: Prisma.VendorDefectiveReturnWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnWhereInput | Prisma.VendorDefectiveReturnWhereInput[];
    vendorId?: Prisma.StringFilter<"VendorDefectiveReturn"> | string;
    totalAmount?: Prisma.DecimalFilter<"VendorDefectiveReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    vendor?: Prisma.XOR<Prisma.VendorScalarRelationFilter, Prisma.VendorWhereInput>;
    bikes?: Prisma.VendorDefectiveReturnBikeListRelationFilter;
    partLines?: Prisma.VendorDefectiveReturnPartLineListRelationFilter;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "journalEntryId">;
export type VendorDefectiveReturnOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VendorDefectiveReturnCountOrderByAggregateInput;
    _avg?: Prisma.VendorDefectiveReturnAvgOrderByAggregateInput;
    _max?: Prisma.VendorDefectiveReturnMaxOrderByAggregateInput;
    _min?: Prisma.VendorDefectiveReturnMinOrderByAggregateInput;
    _sum?: Prisma.VendorDefectiveReturnSumOrderByAggregateInput;
};
export type VendorDefectiveReturnScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorDefectiveReturnScalarWhereWithAggregatesInput | Prisma.VendorDefectiveReturnScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorDefectiveReturnScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorDefectiveReturnScalarWhereWithAggregatesInput | Prisma.VendorDefectiveReturnScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturn"> | string;
    vendorId?: Prisma.StringWithAggregatesFilter<"VendorDefectiveReturn"> | string;
    totalAmount?: Prisma.DecimalWithAggregatesFilter<"VendorDefectiveReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"VendorDefectiveReturn"> | Date | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"VendorDefectiveReturn"> | string | null;
    journalEntryId?: Prisma.StringNullableWithAggregatesFilter<"VendorDefectiveReturn"> | string | null;
    recordedById?: Prisma.StringNullableWithAggregatesFilter<"VendorDefectiveReturn"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"VendorDefectiveReturn"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"VendorDefectiveReturn"> | Date | string;
};
export type VendorDefectiveReturnCreateInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutDefectiveReturnsInput;
    bikes?: Prisma.VendorDefectiveReturnBikeCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineCreateNestedManyWithoutReturnInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorDefectiveReturnInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorDefectiveReturnsRecordedInput;
};
export type VendorDefectiveReturnUncheckedCreateInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutReturnInput;
};
export type VendorDefectiveReturnUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutDefectiveReturnsNestedInput;
    bikes?: Prisma.VendorDefectiveReturnBikeUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithoutReturnNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorDefectiveReturnNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorDefectiveReturnsRecordedNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnNestedInput;
};
export type VendorDefectiveReturnCreateManyInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorDefectiveReturnUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorDefectiveReturnUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorDefectiveReturnListRelationFilter = {
    every?: Prisma.VendorDefectiveReturnWhereInput;
    some?: Prisma.VendorDefectiveReturnWhereInput;
    none?: Prisma.VendorDefectiveReturnWhereInput;
};
export type VendorDefectiveReturnOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VendorDefectiveReturnNullableScalarRelationFilter = {
    is?: Prisma.VendorDefectiveReturnWhereInput | null;
    isNot?: Prisma.VendorDefectiveReturnWhereInput | null;
};
export type VendorDefectiveReturnCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorDefectiveReturnAvgOrderByAggregateInput = {
    totalAmount?: Prisma.SortOrder;
};
export type VendorDefectiveReturnMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorDefectiveReturnMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorDefectiveReturnSumOrderByAggregateInput = {
    totalAmount?: Prisma.SortOrder;
};
export type VendorDefectiveReturnScalarRelationFilter = {
    is?: Prisma.VendorDefectiveReturnWhereInput;
    isNot?: Prisma.VendorDefectiveReturnWhereInput;
};
export type VendorDefectiveReturnCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput> | Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyRecordedByInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
};
export type VendorDefectiveReturnUncheckedCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput> | Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyRecordedByInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
};
export type VendorDefectiveReturnUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput> | Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyRecordedByInputEnvelope;
    set?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutRecordedByInput | Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.VendorDefectiveReturnScalarWhereInput | Prisma.VendorDefectiveReturnScalarWhereInput[];
};
export type VendorDefectiveReturnUncheckedUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput> | Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyRecordedByInputEnvelope;
    set?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutRecordedByInput | Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.VendorDefectiveReturnScalarWhereInput | Prisma.VendorDefectiveReturnScalarWhereInput[];
};
export type VendorDefectiveReturnCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput> | Prisma.VendorDefectiveReturnCreateWithoutVendorInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyVendorInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
};
export type VendorDefectiveReturnUncheckedCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput> | Prisma.VendorDefectiveReturnCreateWithoutVendorInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyVendorInputEnvelope;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
};
export type VendorDefectiveReturnUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput> | Prisma.VendorDefectiveReturnCreateWithoutVendorInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutVendorInput | Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyVendorInputEnvelope;
    set?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutVendorInput | Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutVendorInput | Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.VendorDefectiveReturnScalarWhereInput | Prisma.VendorDefectiveReturnScalarWhereInput[];
};
export type VendorDefectiveReturnUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput> | Prisma.VendorDefectiveReturnCreateWithoutVendorInput[] | Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput | Prisma.VendorDefectiveReturnCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutVendorInput | Prisma.VendorDefectiveReturnUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.VendorDefectiveReturnCreateManyVendorInputEnvelope;
    set?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    disconnect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    delete?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput | Prisma.VendorDefectiveReturnWhereUniqueInput[];
    update?: Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutVendorInput | Prisma.VendorDefectiveReturnUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutVendorInput | Prisma.VendorDefectiveReturnUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.VendorDefectiveReturnScalarWhereInput | Prisma.VendorDefectiveReturnScalarWhereInput[];
};
export type VendorDefectiveReturnCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnUncheckedCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.VendorDefectiveReturnUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.VendorDefectiveReturnWhereInput | boolean;
    delete?: Prisma.VendorDefectiveReturnWhereInput | boolean;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorDefectiveReturnUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUpdateWithoutJournalEntryInput>, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorDefectiveReturnUncheckedUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.VendorDefectiveReturnUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.VendorDefectiveReturnWhereInput | boolean;
    delete?: Prisma.VendorDefectiveReturnWhereInput | boolean;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorDefectiveReturnUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUpdateWithoutJournalEntryInput>, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorDefectiveReturnCreateNestedOneWithoutBikesInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutBikesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutBikesInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutBikesInput;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnUpdateOneRequiredWithoutBikesNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutBikesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutBikesInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutBikesInput;
    upsert?: Prisma.VendorDefectiveReturnUpsertWithoutBikesInput;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorDefectiveReturnUpdateToOneWithWhereWithoutBikesInput, Prisma.VendorDefectiveReturnUpdateWithoutBikesInput>, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutBikesInput>;
};
export type VendorDefectiveReturnCreateNestedOneWithoutPartLinesInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutPartLinesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutPartLinesInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutPartLinesInput;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnUpdateOneRequiredWithoutPartLinesNestedInput = {
    create?: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutPartLinesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutPartLinesInput>;
    connectOrCreate?: Prisma.VendorDefectiveReturnCreateOrConnectWithoutPartLinesInput;
    upsert?: Prisma.VendorDefectiveReturnUpsertWithoutPartLinesInput;
    connect?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorDefectiveReturnUpdateToOneWithWhereWithoutPartLinesInput, Prisma.VendorDefectiveReturnUpdateWithoutPartLinesInput>, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutPartLinesInput>;
};
export type VendorDefectiveReturnCreateWithoutRecordedByInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutDefectiveReturnsInput;
    bikes?: Prisma.VendorDefectiveReturnBikeCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineCreateNestedManyWithoutReturnInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorDefectiveReturnInput;
};
export type VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutReturnInput;
};
export type VendorDefectiveReturnCreateOrConnectWithoutRecordedByInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput>;
};
export type VendorDefectiveReturnCreateManyRecordedByInputEnvelope = {
    data: Prisma.VendorDefectiveReturnCreateManyRecordedByInput | Prisma.VendorDefectiveReturnCreateManyRecordedByInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnUpsertWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutRecordedByInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutRecordedByInput>;
};
export type VendorDefectiveReturnUpdateWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutRecordedByInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutRecordedByInput>;
};
export type VendorDefectiveReturnUpdateManyWithWhereWithoutRecordedByInput = {
    where: Prisma.VendorDefectiveReturnScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateManyMutationInput, Prisma.VendorDefectiveReturnUncheckedUpdateManyWithoutRecordedByInput>;
};
export type VendorDefectiveReturnScalarWhereInput = {
    AND?: Prisma.VendorDefectiveReturnScalarWhereInput | Prisma.VendorDefectiveReturnScalarWhereInput[];
    OR?: Prisma.VendorDefectiveReturnScalarWhereInput[];
    NOT?: Prisma.VendorDefectiveReturnScalarWhereInput | Prisma.VendorDefectiveReturnScalarWhereInput[];
    id?: Prisma.StringFilter<"VendorDefectiveReturn"> | string;
    vendorId?: Prisma.StringFilter<"VendorDefectiveReturn"> | string;
    totalAmount?: Prisma.DecimalFilter<"VendorDefectiveReturn"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorDefectiveReturn"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorDefectiveReturn"> | Date | string;
};
export type VendorDefectiveReturnCreateWithoutVendorInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineCreateNestedManyWithoutReturnInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorDefectiveReturnInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorDefectiveReturnsRecordedInput;
};
export type VendorDefectiveReturnUncheckedCreateWithoutVendorInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutReturnInput;
};
export type VendorDefectiveReturnCreateOrConnectWithoutVendorInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput>;
};
export type VendorDefectiveReturnCreateManyVendorInputEnvelope = {
    data: Prisma.VendorDefectiveReturnCreateManyVendorInput | Prisma.VendorDefectiveReturnCreateManyVendorInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnUpsertWithWhereUniqueWithoutVendorInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutVendorInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutVendorInput>;
};
export type VendorDefectiveReturnUpdateWithWhereUniqueWithoutVendorInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutVendorInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutVendorInput>;
};
export type VendorDefectiveReturnUpdateManyWithWhereWithoutVendorInput = {
    where: Prisma.VendorDefectiveReturnScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateManyMutationInput, Prisma.VendorDefectiveReturnUncheckedUpdateManyWithoutVendorInput>;
};
export type VendorDefectiveReturnCreateWithoutJournalEntryInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutDefectiveReturnsInput;
    bikes?: Prisma.VendorDefectiveReturnBikeCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineCreateNestedManyWithoutReturnInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorDefectiveReturnsRecordedInput;
};
export type VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedCreateNestedManyWithoutReturnInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutReturnInput;
};
export type VendorDefectiveReturnCreateOrConnectWithoutJournalEntryInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput>;
};
export type VendorDefectiveReturnUpsertWithoutJournalEntryInput = {
    update: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutJournalEntryInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutJournalEntryInput>;
    where?: Prisma.VendorDefectiveReturnWhereInput;
};
export type VendorDefectiveReturnUpdateToOneWithWhereWithoutJournalEntryInput = {
    where?: Prisma.VendorDefectiveReturnWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutJournalEntryInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorDefectiveReturnUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutDefectiveReturnsNestedInput;
    bikes?: Prisma.VendorDefectiveReturnBikeUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithoutReturnNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorDefectiveReturnsRecordedNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnNestedInput;
};
export type VendorDefectiveReturnCreateWithoutBikesInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutDefectiveReturnsInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineCreateNestedManyWithoutReturnInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorDefectiveReturnInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorDefectiveReturnsRecordedInput;
};
export type VendorDefectiveReturnUncheckedCreateWithoutBikesInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedCreateNestedManyWithoutReturnInput;
};
export type VendorDefectiveReturnCreateOrConnectWithoutBikesInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutBikesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutBikesInput>;
};
export type VendorDefectiveReturnUpsertWithoutBikesInput = {
    update: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutBikesInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutBikesInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutBikesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutBikesInput>;
    where?: Prisma.VendorDefectiveReturnWhereInput;
};
export type VendorDefectiveReturnUpdateToOneWithWhereWithoutBikesInput = {
    where?: Prisma.VendorDefectiveReturnWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutBikesInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutBikesInput>;
};
export type VendorDefectiveReturnUpdateWithoutBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutDefectiveReturnsNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithoutReturnNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorDefectiveReturnNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorDefectiveReturnsRecordedNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateWithoutBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnNestedInput;
};
export type VendorDefectiveReturnCreateWithoutPartLinesInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutDefectiveReturnsInput;
    bikes?: Prisma.VendorDefectiveReturnBikeCreateNestedManyWithoutReturnInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorDefectiveReturnInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorDefectiveReturnsRecordedInput;
};
export type VendorDefectiveReturnUncheckedCreateWithoutPartLinesInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedCreateNestedManyWithoutReturnInput;
};
export type VendorDefectiveReturnCreateOrConnectWithoutPartLinesInput = {
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutPartLinesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutPartLinesInput>;
};
export type VendorDefectiveReturnUpsertWithoutPartLinesInput = {
    update: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutPartLinesInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutPartLinesInput>;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateWithoutPartLinesInput, Prisma.VendorDefectiveReturnUncheckedCreateWithoutPartLinesInput>;
    where?: Prisma.VendorDefectiveReturnWhereInput;
};
export type VendorDefectiveReturnUpdateToOneWithWhereWithoutPartLinesInput = {
    where?: Prisma.VendorDefectiveReturnWhereInput;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateWithoutPartLinesInput, Prisma.VendorDefectiveReturnUncheckedUpdateWithoutPartLinesInput>;
};
export type VendorDefectiveReturnUpdateWithoutPartLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutDefectiveReturnsNestedInput;
    bikes?: Prisma.VendorDefectiveReturnBikeUpdateManyWithoutReturnNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorDefectiveReturnNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorDefectiveReturnsRecordedNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateWithoutPartLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnNestedInput;
};
export type VendorDefectiveReturnCreateManyRecordedByInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorDefectiveReturnUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutDefectiveReturnsNestedInput;
    bikes?: Prisma.VendorDefectiveReturnBikeUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithoutReturnNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorDefectiveReturnNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateManyWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorDefectiveReturnCreateManyVendorInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorDefectiveReturnUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUpdateManyWithoutReturnNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorDefectiveReturnNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorDefectiveReturnsRecordedNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.VendorDefectiveReturnBikeUncheckedUpdateManyWithoutReturnNestedInput;
    partLines?: Prisma.VendorDefectiveReturnPartLineUncheckedUpdateManyWithoutReturnNestedInput;
};
export type VendorDefectiveReturnUncheckedUpdateManyWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorDefectiveReturnCountOutputType = {
    bikes: number;
    partLines: number;
};
export type VendorDefectiveReturnCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bikes?: boolean | VendorDefectiveReturnCountOutputTypeCountBikesArgs;
    partLines?: boolean | VendorDefectiveReturnCountOutputTypeCountPartLinesArgs;
};
export type VendorDefectiveReturnCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnCountOutputTypeSelect<ExtArgs> | null;
};
export type VendorDefectiveReturnCountOutputTypeCountBikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnBikeWhereInput;
};
export type VendorDefectiveReturnCountOutputTypeCountPartLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnPartLineWhereInput;
};
export type VendorDefectiveReturnSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vendorId?: boolean;
    totalAmount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    bikes?: boolean | Prisma.VendorDefectiveReturn$bikesArgs<ExtArgs>;
    partLines?: boolean | Prisma.VendorDefectiveReturn$partLinesArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorDefectiveReturnCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturn"]>;
export type VendorDefectiveReturnSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vendorId?: boolean;
    totalAmount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturn"]>;
export type VendorDefectiveReturnSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vendorId?: boolean;
    totalAmount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorDefectiveReturn"]>;
export type VendorDefectiveReturnSelectScalar = {
    id?: boolean;
    vendorId?: boolean;
    totalAmount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type VendorDefectiveReturnOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "vendorId" | "totalAmount" | "date" | "notes" | "journalEntryId" | "recordedById" | "createdAt" | "updatedAt", ExtArgs["result"]["vendorDefectiveReturn"]>;
export type VendorDefectiveReturnInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    bikes?: boolean | Prisma.VendorDefectiveReturn$bikesArgs<ExtArgs>;
    partLines?: boolean | Prisma.VendorDefectiveReturn$partLinesArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorDefectiveReturnCountOutputTypeDefaultArgs<ExtArgs>;
};
export type VendorDefectiveReturnIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>;
};
export type VendorDefectiveReturnIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>;
};
export type $VendorDefectiveReturnPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VendorDefectiveReturn";
    objects: {
        vendor: Prisma.$VendorPayload<ExtArgs>;
        bikes: Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>[];
        partLines: Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>[];
        journalEntry: Prisma.$JournalEntryPayload<ExtArgs> | null;
        recordedBy: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        vendorId: string;
        totalAmount: runtime.Decimal;
        date: Date;
        notes: string | null;
        journalEntryId: string | null;
        recordedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["vendorDefectiveReturn"]>;
    composites: {};
};
export type VendorDefectiveReturnGetPayload<S extends boolean | null | undefined | VendorDefectiveReturnDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload, S>;
export type VendorDefectiveReturnCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorDefectiveReturnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorDefectiveReturnCountAggregateInputType | true;
};
export interface VendorDefectiveReturnDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VendorDefectiveReturn'];
        meta: {
            name: 'VendorDefectiveReturn';
        };
    };
    findUnique<T extends VendorDefectiveReturnFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorDefectiveReturnFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorDefectiveReturnFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorDefectiveReturnFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorDefectiveReturnFindManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorDefectiveReturnCreateArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnCreateArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorDefectiveReturnCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorDefectiveReturnCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorDefectiveReturnDeleteArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorDefectiveReturnUpdateArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorDefectiveReturnDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorDefectiveReturnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorDefectiveReturnUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorDefectiveReturnUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorDefectiveReturnUpsertArgs>(args: Prisma.SelectSubset<T, VendorDefectiveReturnUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorDefectiveReturnCountArgs>(args?: Prisma.Subset<T, VendorDefectiveReturnCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorDefectiveReturnCountAggregateOutputType> : number>;
    aggregate<T extends VendorDefectiveReturnAggregateArgs>(args: Prisma.Subset<T, VendorDefectiveReturnAggregateArgs>): Prisma.PrismaPromise<GetVendorDefectiveReturnAggregateType<T>>;
    groupBy<T extends VendorDefectiveReturnGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorDefectiveReturnGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorDefectiveReturnGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorDefectiveReturnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorDefectiveReturnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorDefectiveReturnFieldRefs;
}
export interface Prisma__VendorDefectiveReturnClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    vendor<T extends Prisma.VendorDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefaultArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    bikes<T extends Prisma.VendorDefectiveReturn$bikesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefectiveReturn$bikesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnBikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    partLines<T extends Prisma.VendorDefectiveReturn$partLinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefectiveReturn$partLinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPartLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    journalEntry<T extends Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefectiveReturn$journalEntryArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    recordedBy<T extends Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefectiveReturn$recordedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorDefectiveReturnFieldRefs {
    readonly id: Prisma.FieldRef<"VendorDefectiveReturn", 'String'>;
    readonly vendorId: Prisma.FieldRef<"VendorDefectiveReturn", 'String'>;
    readonly totalAmount: Prisma.FieldRef<"VendorDefectiveReturn", 'Decimal'>;
    readonly date: Prisma.FieldRef<"VendorDefectiveReturn", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"VendorDefectiveReturn", 'String'>;
    readonly journalEntryId: Prisma.FieldRef<"VendorDefectiveReturn", 'String'>;
    readonly recordedById: Prisma.FieldRef<"VendorDefectiveReturn", 'String'>;
    readonly createdAt: Prisma.FieldRef<"VendorDefectiveReturn", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"VendorDefectiveReturn", 'DateTime'>;
}
export type VendorDefectiveReturnFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnOrderByWithRelationInput | Prisma.VendorDefectiveReturnOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnScalarFieldEnum | Prisma.VendorDefectiveReturnScalarFieldEnum[];
};
export type VendorDefectiveReturnFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnOrderByWithRelationInput | Prisma.VendorDefectiveReturnOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnScalarFieldEnum | Prisma.VendorDefectiveReturnScalarFieldEnum[];
};
export type VendorDefectiveReturnFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnWhereInput;
    orderBy?: Prisma.VendorDefectiveReturnOrderByWithRelationInput | Prisma.VendorDefectiveReturnOrderByWithRelationInput[];
    cursor?: Prisma.VendorDefectiveReturnWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorDefectiveReturnScalarFieldEnum | Prisma.VendorDefectiveReturnScalarFieldEnum[];
};
export type VendorDefectiveReturnCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnCreateInput, Prisma.VendorDefectiveReturnUncheckedCreateInput>;
};
export type VendorDefectiveReturnCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorDefectiveReturnCreateManyInput | Prisma.VendorDefectiveReturnCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorDefectiveReturnCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    data: Prisma.VendorDefectiveReturnCreateManyInput | Prisma.VendorDefectiveReturnCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VendorDefectiveReturnIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VendorDefectiveReturnUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateInput, Prisma.VendorDefectiveReturnUncheckedUpdateInput>;
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateManyMutationInput, Prisma.VendorDefectiveReturnUncheckedUpdateManyInput>;
    where?: Prisma.VendorDefectiveReturnWhereInput;
    limit?: number;
};
export type VendorDefectiveReturnUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateManyMutationInput, Prisma.VendorDefectiveReturnUncheckedUpdateManyInput>;
    where?: Prisma.VendorDefectiveReturnWhereInput;
    limit?: number;
    include?: Prisma.VendorDefectiveReturnIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VendorDefectiveReturnUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorDefectiveReturnCreateInput, Prisma.VendorDefectiveReturnUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorDefectiveReturnUpdateInput, Prisma.VendorDefectiveReturnUncheckedUpdateInput>;
};
export type VendorDefectiveReturnDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where: Prisma.VendorDefectiveReturnWhereUniqueInput;
};
export type VendorDefectiveReturnDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorDefectiveReturnWhereInput;
    limit?: number;
};
export type VendorDefectiveReturn$bikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VendorDefectiveReturn$partLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VendorDefectiveReturn$journalEntryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
};
export type VendorDefectiveReturn$recordedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type VendorDefectiveReturnDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
};
