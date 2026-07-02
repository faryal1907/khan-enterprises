import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorAllocationModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorAllocationPayload>;
export type AggregateVendorAllocation = {
    _count: VendorAllocationCountAggregateOutputType | null;
    _avg: VendorAllocationAvgAggregateOutputType | null;
    _sum: VendorAllocationSumAggregateOutputType | null;
    _min: VendorAllocationMinAggregateOutputType | null;
    _max: VendorAllocationMaxAggregateOutputType | null;
};
export type VendorAllocationAvgAggregateOutputType = {
    totalAmount: runtime.Decimal | null;
};
export type VendorAllocationSumAggregateOutputType = {
    totalAmount: runtime.Decimal | null;
};
export type VendorAllocationMinAggregateOutputType = {
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
export type VendorAllocationMaxAggregateOutputType = {
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
export type VendorAllocationCountAggregateOutputType = {
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
export type VendorAllocationAvgAggregateInputType = {
    totalAmount?: true;
};
export type VendorAllocationSumAggregateInputType = {
    totalAmount?: true;
};
export type VendorAllocationMinAggregateInputType = {
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
export type VendorAllocationMaxAggregateInputType = {
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
export type VendorAllocationCountAggregateInputType = {
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
export type VendorAllocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationWhereInput;
    orderBy?: Prisma.VendorAllocationOrderByWithRelationInput | Prisma.VendorAllocationOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorAllocationCountAggregateInputType;
    _avg?: VendorAllocationAvgAggregateInputType;
    _sum?: VendorAllocationSumAggregateInputType;
    _min?: VendorAllocationMinAggregateInputType;
    _max?: VendorAllocationMaxAggregateInputType;
};
export type GetVendorAllocationAggregateType<T extends VendorAllocationAggregateArgs> = {
    [P in keyof T & keyof AggregateVendorAllocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendorAllocation[P]> : Prisma.GetScalarType<T[P], AggregateVendorAllocation[P]>;
};
export type VendorAllocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationWhereInput;
    orderBy?: Prisma.VendorAllocationOrderByWithAggregationInput | Prisma.VendorAllocationOrderByWithAggregationInput[];
    by: Prisma.VendorAllocationScalarFieldEnum[] | Prisma.VendorAllocationScalarFieldEnum;
    having?: Prisma.VendorAllocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorAllocationCountAggregateInputType | true;
    _avg?: VendorAllocationAvgAggregateInputType;
    _sum?: VendorAllocationSumAggregateInputType;
    _min?: VendorAllocationMinAggregateInputType;
    _max?: VendorAllocationMaxAggregateInputType;
};
export type VendorAllocationGroupByOutputType = {
    id: string;
    vendorId: string;
    totalAmount: runtime.Decimal;
    date: Date;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorAllocationCountAggregateOutputType | null;
    _avg: VendorAllocationAvgAggregateOutputType | null;
    _sum: VendorAllocationSumAggregateOutputType | null;
    _min: VendorAllocationMinAggregateOutputType | null;
    _max: VendorAllocationMaxAggregateOutputType | null;
};
export type GetVendorAllocationGroupByPayload<T extends VendorAllocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorAllocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorAllocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorAllocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorAllocationGroupByOutputType[P]>;
}>>;
export type VendorAllocationWhereInput = {
    AND?: Prisma.VendorAllocationWhereInput | Prisma.VendorAllocationWhereInput[];
    OR?: Prisma.VendorAllocationWhereInput[];
    NOT?: Prisma.VendorAllocationWhereInput | Prisma.VendorAllocationWhereInput[];
    id?: Prisma.StringFilter<"VendorAllocation"> | string;
    vendorId?: Prisma.StringFilter<"VendorAllocation"> | string;
    totalAmount?: Prisma.DecimalFilter<"VendorAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    vendor?: Prisma.XOR<Prisma.VendorScalarRelationFilter, Prisma.VendorWhereInput>;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    bikes?: Prisma.BikeUnitListRelationFilter;
    partLines?: Prisma.VendorAllocationPartLineListRelationFilter;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type VendorAllocationOrderByWithRelationInput = {
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
    journalEntry?: Prisma.JournalEntryOrderByWithRelationInput;
    bikes?: Prisma.BikeUnitOrderByRelationAggregateInput;
    partLines?: Prisma.VendorAllocationPartLineOrderByRelationAggregateInput;
    recordedBy?: Prisma.UserOrderByWithRelationInput;
};
export type VendorAllocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    journalEntryId?: string;
    AND?: Prisma.VendorAllocationWhereInput | Prisma.VendorAllocationWhereInput[];
    OR?: Prisma.VendorAllocationWhereInput[];
    NOT?: Prisma.VendorAllocationWhereInput | Prisma.VendorAllocationWhereInput[];
    vendorId?: Prisma.StringFilter<"VendorAllocation"> | string;
    totalAmount?: Prisma.DecimalFilter<"VendorAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    vendor?: Prisma.XOR<Prisma.VendorScalarRelationFilter, Prisma.VendorWhereInput>;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    bikes?: Prisma.BikeUnitListRelationFilter;
    partLines?: Prisma.VendorAllocationPartLineListRelationFilter;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "journalEntryId">;
export type VendorAllocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VendorAllocationCountOrderByAggregateInput;
    _avg?: Prisma.VendorAllocationAvgOrderByAggregateInput;
    _max?: Prisma.VendorAllocationMaxOrderByAggregateInput;
    _min?: Prisma.VendorAllocationMinOrderByAggregateInput;
    _sum?: Prisma.VendorAllocationSumOrderByAggregateInput;
};
export type VendorAllocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorAllocationScalarWhereWithAggregatesInput | Prisma.VendorAllocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorAllocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorAllocationScalarWhereWithAggregatesInput | Prisma.VendorAllocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VendorAllocation"> | string;
    vendorId?: Prisma.StringWithAggregatesFilter<"VendorAllocation"> | string;
    totalAmount?: Prisma.DecimalWithAggregatesFilter<"VendorAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"VendorAllocation"> | Date | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"VendorAllocation"> | string | null;
    journalEntryId?: Prisma.StringNullableWithAggregatesFilter<"VendorAllocation"> | string | null;
    recordedById?: Prisma.StringNullableWithAggregatesFilter<"VendorAllocation"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"VendorAllocation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"VendorAllocation"> | Date | string;
};
export type VendorAllocationCreateInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutAllocationsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorAllocationInput;
    bikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutAllocationInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorAllocationsRecordedInput;
};
export type VendorAllocationUncheckedCreateInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutAllocationInput;
};
export type VendorAllocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutAllocationsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorAllocationNestedInput;
    bikes?: Prisma.BikeUnitUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutAllocationNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorAllocationsRecordedNestedInput;
};
export type VendorAllocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationNestedInput;
};
export type VendorAllocationCreateManyInput = {
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
export type VendorAllocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorAllocationUncheckedUpdateManyInput = {
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
export type VendorAllocationListRelationFilter = {
    every?: Prisma.VendorAllocationWhereInput;
    some?: Prisma.VendorAllocationWhereInput;
    none?: Prisma.VendorAllocationWhereInput;
};
export type VendorAllocationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VendorAllocationNullableScalarRelationFilter = {
    is?: Prisma.VendorAllocationWhereInput | null;
    isNot?: Prisma.VendorAllocationWhereInput | null;
};
export type VendorAllocationCountOrderByAggregateInput = {
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
export type VendorAllocationAvgOrderByAggregateInput = {
    totalAmount?: Prisma.SortOrder;
};
export type VendorAllocationMaxOrderByAggregateInput = {
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
export type VendorAllocationMinOrderByAggregateInput = {
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
export type VendorAllocationSumOrderByAggregateInput = {
    totalAmount?: Prisma.SortOrder;
};
export type VendorAllocationScalarRelationFilter = {
    is?: Prisma.VendorAllocationWhereInput;
    isNot?: Prisma.VendorAllocationWhereInput;
};
export type VendorAllocationCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput> | Prisma.VendorAllocationCreateWithoutRecordedByInput[] | Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput | Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.VendorAllocationCreateManyRecordedByInputEnvelope;
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
};
export type VendorAllocationUncheckedCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput> | Prisma.VendorAllocationCreateWithoutRecordedByInput[] | Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput | Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.VendorAllocationCreateManyRecordedByInputEnvelope;
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
};
export type VendorAllocationUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput> | Prisma.VendorAllocationCreateWithoutRecordedByInput[] | Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput | Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.VendorAllocationUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.VendorAllocationUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.VendorAllocationCreateManyRecordedByInputEnvelope;
    set?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    delete?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    update?: Prisma.VendorAllocationUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.VendorAllocationUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.VendorAllocationUpdateManyWithWhereWithoutRecordedByInput | Prisma.VendorAllocationUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.VendorAllocationScalarWhereInput | Prisma.VendorAllocationScalarWhereInput[];
};
export type VendorAllocationUncheckedUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput> | Prisma.VendorAllocationCreateWithoutRecordedByInput[] | Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput | Prisma.VendorAllocationCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.VendorAllocationUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.VendorAllocationUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.VendorAllocationCreateManyRecordedByInputEnvelope;
    set?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    delete?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    update?: Prisma.VendorAllocationUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.VendorAllocationUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.VendorAllocationUpdateManyWithWhereWithoutRecordedByInput | Prisma.VendorAllocationUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.VendorAllocationScalarWhereInput | Prisma.VendorAllocationScalarWhereInput[];
};
export type VendorAllocationCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutVendorInput, Prisma.VendorAllocationUncheckedCreateWithoutVendorInput> | Prisma.VendorAllocationCreateWithoutVendorInput[] | Prisma.VendorAllocationUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutVendorInput | Prisma.VendorAllocationCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.VendorAllocationCreateManyVendorInputEnvelope;
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
};
export type VendorAllocationUncheckedCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutVendorInput, Prisma.VendorAllocationUncheckedCreateWithoutVendorInput> | Prisma.VendorAllocationCreateWithoutVendorInput[] | Prisma.VendorAllocationUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutVendorInput | Prisma.VendorAllocationCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.VendorAllocationCreateManyVendorInputEnvelope;
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
};
export type VendorAllocationUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutVendorInput, Prisma.VendorAllocationUncheckedCreateWithoutVendorInput> | Prisma.VendorAllocationCreateWithoutVendorInput[] | Prisma.VendorAllocationUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutVendorInput | Prisma.VendorAllocationCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.VendorAllocationUpsertWithWhereUniqueWithoutVendorInput | Prisma.VendorAllocationUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.VendorAllocationCreateManyVendorInputEnvelope;
    set?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    delete?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    update?: Prisma.VendorAllocationUpdateWithWhereUniqueWithoutVendorInput | Prisma.VendorAllocationUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.VendorAllocationUpdateManyWithWhereWithoutVendorInput | Prisma.VendorAllocationUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.VendorAllocationScalarWhereInput | Prisma.VendorAllocationScalarWhereInput[];
};
export type VendorAllocationUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutVendorInput, Prisma.VendorAllocationUncheckedCreateWithoutVendorInput> | Prisma.VendorAllocationCreateWithoutVendorInput[] | Prisma.VendorAllocationUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutVendorInput | Prisma.VendorAllocationCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.VendorAllocationUpsertWithWhereUniqueWithoutVendorInput | Prisma.VendorAllocationUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.VendorAllocationCreateManyVendorInputEnvelope;
    set?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    disconnect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    delete?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    connect?: Prisma.VendorAllocationWhereUniqueInput | Prisma.VendorAllocationWhereUniqueInput[];
    update?: Prisma.VendorAllocationUpdateWithWhereUniqueWithoutVendorInput | Prisma.VendorAllocationUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.VendorAllocationUpdateManyWithWhereWithoutVendorInput | Prisma.VendorAllocationUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.VendorAllocationScalarWhereInput | Prisma.VendorAllocationScalarWhereInput[];
};
export type VendorAllocationCreateNestedOneWithoutBikesInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutBikesInput, Prisma.VendorAllocationUncheckedCreateWithoutBikesInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutBikesInput;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationUpdateOneWithoutBikesNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutBikesInput, Prisma.VendorAllocationUncheckedCreateWithoutBikesInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutBikesInput;
    upsert?: Prisma.VendorAllocationUpsertWithoutBikesInput;
    disconnect?: Prisma.VendorAllocationWhereInput | boolean;
    delete?: Prisma.VendorAllocationWhereInput | boolean;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorAllocationUpdateToOneWithWhereWithoutBikesInput, Prisma.VendorAllocationUpdateWithoutBikesInput>, Prisma.VendorAllocationUncheckedUpdateWithoutBikesInput>;
};
export type VendorAllocationCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationUncheckedCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.VendorAllocationUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.VendorAllocationWhereInput | boolean;
    delete?: Prisma.VendorAllocationWhereInput | boolean;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorAllocationUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.VendorAllocationUpdateWithoutJournalEntryInput>, Prisma.VendorAllocationUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorAllocationUncheckedUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.VendorAllocationUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.VendorAllocationWhereInput | boolean;
    delete?: Prisma.VendorAllocationWhereInput | boolean;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorAllocationUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.VendorAllocationUpdateWithoutJournalEntryInput>, Prisma.VendorAllocationUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorAllocationCreateNestedOneWithoutPartLinesInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutPartLinesInput, Prisma.VendorAllocationUncheckedCreateWithoutPartLinesInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutPartLinesInput;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationUpdateOneRequiredWithoutPartLinesNestedInput = {
    create?: Prisma.XOR<Prisma.VendorAllocationCreateWithoutPartLinesInput, Prisma.VendorAllocationUncheckedCreateWithoutPartLinesInput>;
    connectOrCreate?: Prisma.VendorAllocationCreateOrConnectWithoutPartLinesInput;
    upsert?: Prisma.VendorAllocationUpsertWithoutPartLinesInput;
    connect?: Prisma.VendorAllocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorAllocationUpdateToOneWithWhereWithoutPartLinesInput, Prisma.VendorAllocationUpdateWithoutPartLinesInput>, Prisma.VendorAllocationUncheckedUpdateWithoutPartLinesInput>;
};
export type VendorAllocationCreateWithoutRecordedByInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutAllocationsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorAllocationInput;
    bikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutAllocationInput;
};
export type VendorAllocationUncheckedCreateWithoutRecordedByInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutAllocationInput;
};
export type VendorAllocationCreateOrConnectWithoutRecordedByInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput>;
};
export type VendorAllocationCreateManyRecordedByInputEnvelope = {
    data: Prisma.VendorAllocationCreateManyRecordedByInput | Prisma.VendorAllocationCreateManyRecordedByInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationUpsertWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedUpdateWithoutRecordedByInput>;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedCreateWithoutRecordedByInput>;
};
export type VendorAllocationUpdateWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutRecordedByInput, Prisma.VendorAllocationUncheckedUpdateWithoutRecordedByInput>;
};
export type VendorAllocationUpdateManyWithWhereWithoutRecordedByInput = {
    where: Prisma.VendorAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateManyMutationInput, Prisma.VendorAllocationUncheckedUpdateManyWithoutRecordedByInput>;
};
export type VendorAllocationScalarWhereInput = {
    AND?: Prisma.VendorAllocationScalarWhereInput | Prisma.VendorAllocationScalarWhereInput[];
    OR?: Prisma.VendorAllocationScalarWhereInput[];
    NOT?: Prisma.VendorAllocationScalarWhereInput | Prisma.VendorAllocationScalarWhereInput[];
    id?: Prisma.StringFilter<"VendorAllocation"> | string;
    vendorId?: Prisma.StringFilter<"VendorAllocation"> | string;
    totalAmount?: Prisma.DecimalFilter<"VendorAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorAllocation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorAllocation"> | Date | string;
};
export type VendorAllocationCreateWithoutVendorInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorAllocationInput;
    bikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutAllocationInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorAllocationsRecordedInput;
};
export type VendorAllocationUncheckedCreateWithoutVendorInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutAllocationInput;
};
export type VendorAllocationCreateOrConnectWithoutVendorInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutVendorInput, Prisma.VendorAllocationUncheckedCreateWithoutVendorInput>;
};
export type VendorAllocationCreateManyVendorInputEnvelope = {
    data: Prisma.VendorAllocationCreateManyVendorInput | Prisma.VendorAllocationCreateManyVendorInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationUpsertWithWhereUniqueWithoutVendorInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutVendorInput, Prisma.VendorAllocationUncheckedUpdateWithoutVendorInput>;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutVendorInput, Prisma.VendorAllocationUncheckedCreateWithoutVendorInput>;
};
export type VendorAllocationUpdateWithWhereUniqueWithoutVendorInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutVendorInput, Prisma.VendorAllocationUncheckedUpdateWithoutVendorInput>;
};
export type VendorAllocationUpdateManyWithWhereWithoutVendorInput = {
    where: Prisma.VendorAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateManyMutationInput, Prisma.VendorAllocationUncheckedUpdateManyWithoutVendorInput>;
};
export type VendorAllocationCreateWithoutBikesInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutAllocationsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutAllocationInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorAllocationsRecordedInput;
};
export type VendorAllocationUncheckedCreateWithoutBikesInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    partLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutAllocationInput;
};
export type VendorAllocationCreateOrConnectWithoutBikesInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutBikesInput, Prisma.VendorAllocationUncheckedCreateWithoutBikesInput>;
};
export type VendorAllocationUpsertWithoutBikesInput = {
    update: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutBikesInput, Prisma.VendorAllocationUncheckedUpdateWithoutBikesInput>;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutBikesInput, Prisma.VendorAllocationUncheckedCreateWithoutBikesInput>;
    where?: Prisma.VendorAllocationWhereInput;
};
export type VendorAllocationUpdateToOneWithWhereWithoutBikesInput = {
    where?: Prisma.VendorAllocationWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutBikesInput, Prisma.VendorAllocationUncheckedUpdateWithoutBikesInput>;
};
export type VendorAllocationUpdateWithoutBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutAllocationsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutAllocationNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorAllocationsRecordedNestedInput;
};
export type VendorAllocationUncheckedUpdateWithoutBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationNestedInput;
};
export type VendorAllocationCreateWithoutJournalEntryInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutAllocationsInput;
    bikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutAllocationInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorAllocationsRecordedInput;
};
export type VendorAllocationUncheckedCreateWithoutJournalEntryInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorAllocationInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutAllocationInput;
};
export type VendorAllocationCreateOrConnectWithoutJournalEntryInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedCreateWithoutJournalEntryInput>;
};
export type VendorAllocationUpsertWithoutJournalEntryInput = {
    update: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedUpdateWithoutJournalEntryInput>;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedCreateWithoutJournalEntryInput>;
    where?: Prisma.VendorAllocationWhereInput;
};
export type VendorAllocationUpdateToOneWithWhereWithoutJournalEntryInput = {
    where?: Prisma.VendorAllocationWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutJournalEntryInput, Prisma.VendorAllocationUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorAllocationUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutAllocationsNestedInput;
    bikes?: Prisma.BikeUnitUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutAllocationNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorAllocationsRecordedNestedInput;
};
export type VendorAllocationUncheckedUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationNestedInput;
};
export type VendorAllocationCreateWithoutPartLinesInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutAllocationsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorAllocationInput;
    bikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorAllocationInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorAllocationsRecordedInput;
};
export type VendorAllocationUncheckedCreateWithoutPartLinesInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorAllocationInput;
};
export type VendorAllocationCreateOrConnectWithoutPartLinesInput = {
    where: Prisma.VendorAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutPartLinesInput, Prisma.VendorAllocationUncheckedCreateWithoutPartLinesInput>;
};
export type VendorAllocationUpsertWithoutPartLinesInput = {
    update: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutPartLinesInput, Prisma.VendorAllocationUncheckedUpdateWithoutPartLinesInput>;
    create: Prisma.XOR<Prisma.VendorAllocationCreateWithoutPartLinesInput, Prisma.VendorAllocationUncheckedCreateWithoutPartLinesInput>;
    where?: Prisma.VendorAllocationWhereInput;
};
export type VendorAllocationUpdateToOneWithWhereWithoutPartLinesInput = {
    where?: Prisma.VendorAllocationWhereInput;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateWithoutPartLinesInput, Prisma.VendorAllocationUncheckedUpdateWithoutPartLinesInput>;
};
export type VendorAllocationUpdateWithoutPartLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutAllocationsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorAllocationNestedInput;
    bikes?: Prisma.BikeUnitUpdateManyWithoutVendorAllocationNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorAllocationsRecordedNestedInput;
};
export type VendorAllocationUncheckedUpdateWithoutPartLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorAllocationNestedInput;
};
export type VendorAllocationCreateManyRecordedByInput = {
    id?: string;
    vendorId: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorAllocationUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutAllocationsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorAllocationNestedInput;
    bikes?: Prisma.BikeUnitUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutAllocationNestedInput;
};
export type VendorAllocationUncheckedUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationNestedInput;
};
export type VendorAllocationUncheckedUpdateManyWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorAllocationCreateManyVendorInput = {
    id?: string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorAllocationUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorAllocationNestedInput;
    bikes?: Prisma.BikeUnitUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutAllocationNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorAllocationsRecordedNestedInput;
};
export type VendorAllocationUncheckedUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorAllocationNestedInput;
    partLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutAllocationNestedInput;
};
export type VendorAllocationUncheckedUpdateManyWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorAllocationCountOutputType = {
    bikes: number;
    partLines: number;
};
export type VendorAllocationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bikes?: boolean | VendorAllocationCountOutputTypeCountBikesArgs;
    partLines?: boolean | VendorAllocationCountOutputTypeCountPartLinesArgs;
};
export type VendorAllocationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationCountOutputTypeSelect<ExtArgs> | null;
};
export type VendorAllocationCountOutputTypeCountBikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeUnitWhereInput;
};
export type VendorAllocationCountOutputTypeCountPartLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationPartLineWhereInput;
};
export type VendorAllocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
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
    journalEntry?: boolean | Prisma.VendorAllocation$journalEntryArgs<ExtArgs>;
    bikes?: boolean | Prisma.VendorAllocation$bikesArgs<ExtArgs>;
    partLines?: boolean | Prisma.VendorAllocation$partLinesArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorAllocation$recordedByArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorAllocationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendorAllocation"]>;
export type VendorAllocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
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
    journalEntry?: boolean | Prisma.VendorAllocation$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorAllocation$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorAllocation"]>;
export type VendorAllocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
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
    journalEntry?: boolean | Prisma.VendorAllocation$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorAllocation$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorAllocation"]>;
export type VendorAllocationSelectScalar = {
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
export type VendorAllocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "vendorId" | "totalAmount" | "date" | "notes" | "journalEntryId" | "recordedById" | "createdAt" | "updatedAt", ExtArgs["result"]["vendorAllocation"]>;
export type VendorAllocationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorAllocation$journalEntryArgs<ExtArgs>;
    bikes?: boolean | Prisma.VendorAllocation$bikesArgs<ExtArgs>;
    partLines?: boolean | Prisma.VendorAllocation$partLinesArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorAllocation$recordedByArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorAllocationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type VendorAllocationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorAllocation$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorAllocation$recordedByArgs<ExtArgs>;
};
export type VendorAllocationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorAllocation$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorAllocation$recordedByArgs<ExtArgs>;
};
export type $VendorAllocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VendorAllocation";
    objects: {
        vendor: Prisma.$VendorPayload<ExtArgs>;
        journalEntry: Prisma.$JournalEntryPayload<ExtArgs> | null;
        bikes: Prisma.$BikeUnitPayload<ExtArgs>[];
        partLines: Prisma.$VendorAllocationPartLinePayload<ExtArgs>[];
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
    }, ExtArgs["result"]["vendorAllocation"]>;
    composites: {};
};
export type VendorAllocationGetPayload<S extends boolean | null | undefined | VendorAllocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload, S>;
export type VendorAllocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorAllocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorAllocationCountAggregateInputType | true;
};
export interface VendorAllocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VendorAllocation'];
        meta: {
            name: 'VendorAllocation';
        };
    };
    findUnique<T extends VendorAllocationFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorAllocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorAllocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorAllocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorAllocationFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorAllocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorAllocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorAllocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorAllocationFindManyArgs>(args?: Prisma.SelectSubset<T, VendorAllocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorAllocationCreateArgs>(args: Prisma.SelectSubset<T, VendorAllocationCreateArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorAllocationCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorAllocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorAllocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorAllocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorAllocationDeleteArgs>(args: Prisma.SelectSubset<T, VendorAllocationDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorAllocationUpdateArgs>(args: Prisma.SelectSubset<T, VendorAllocationUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorAllocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorAllocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorAllocationUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorAllocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorAllocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorAllocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorAllocationUpsertArgs>(args: Prisma.SelectSubset<T, VendorAllocationUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorAllocationCountArgs>(args?: Prisma.Subset<T, VendorAllocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorAllocationCountAggregateOutputType> : number>;
    aggregate<T extends VendorAllocationAggregateArgs>(args: Prisma.Subset<T, VendorAllocationAggregateArgs>): Prisma.PrismaPromise<GetVendorAllocationAggregateType<T>>;
    groupBy<T extends VendorAllocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorAllocationGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorAllocationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorAllocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorAllocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorAllocationFieldRefs;
}
export interface Prisma__VendorAllocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    vendor<T extends Prisma.VendorDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefaultArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    journalEntry<T extends Prisma.VendorAllocation$journalEntryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorAllocation$journalEntryArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    bikes<T extends Prisma.VendorAllocation$bikesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorAllocation$bikesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    partLines<T extends Prisma.VendorAllocation$partLinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorAllocation$partLinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recordedBy<T extends Prisma.VendorAllocation$recordedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorAllocation$recordedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorAllocationFieldRefs {
    readonly id: Prisma.FieldRef<"VendorAllocation", 'String'>;
    readonly vendorId: Prisma.FieldRef<"VendorAllocation", 'String'>;
    readonly totalAmount: Prisma.FieldRef<"VendorAllocation", 'Decimal'>;
    readonly date: Prisma.FieldRef<"VendorAllocation", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"VendorAllocation", 'String'>;
    readonly journalEntryId: Prisma.FieldRef<"VendorAllocation", 'String'>;
    readonly recordedById: Prisma.FieldRef<"VendorAllocation", 'String'>;
    readonly createdAt: Prisma.FieldRef<"VendorAllocation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"VendorAllocation", 'DateTime'>;
}
export type VendorAllocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationWhereInput;
    orderBy?: Prisma.VendorAllocationOrderByWithRelationInput | Prisma.VendorAllocationOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationScalarFieldEnum | Prisma.VendorAllocationScalarFieldEnum[];
};
export type VendorAllocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationWhereInput;
    orderBy?: Prisma.VendorAllocationOrderByWithRelationInput | Prisma.VendorAllocationOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationScalarFieldEnum | Prisma.VendorAllocationScalarFieldEnum[];
};
export type VendorAllocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationWhereInput;
    orderBy?: Prisma.VendorAllocationOrderByWithRelationInput | Prisma.VendorAllocationOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationScalarFieldEnum | Prisma.VendorAllocationScalarFieldEnum[];
};
export type VendorAllocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorAllocationCreateInput, Prisma.VendorAllocationUncheckedCreateInput>;
};
export type VendorAllocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorAllocationCreateManyInput | Prisma.VendorAllocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorAllocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    data: Prisma.VendorAllocationCreateManyInput | Prisma.VendorAllocationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VendorAllocationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VendorAllocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateInput, Prisma.VendorAllocationUncheckedUpdateInput>;
    where: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorAllocationUpdateManyMutationInput, Prisma.VendorAllocationUncheckedUpdateManyInput>;
    where?: Prisma.VendorAllocationWhereInput;
    limit?: number;
};
export type VendorAllocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorAllocationUpdateManyMutationInput, Prisma.VendorAllocationUncheckedUpdateManyInput>;
    where?: Prisma.VendorAllocationWhereInput;
    limit?: number;
    include?: Prisma.VendorAllocationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VendorAllocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorAllocationCreateInput, Prisma.VendorAllocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorAllocationUpdateInput, Prisma.VendorAllocationUncheckedUpdateInput>;
};
export type VendorAllocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where: Prisma.VendorAllocationWhereUniqueInput;
};
export type VendorAllocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationWhereInput;
    limit?: number;
};
export type VendorAllocation$journalEntryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
};
export type VendorAllocation$bikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeUnitSelect<ExtArgs> | null;
    omit?: Prisma.BikeUnitOmit<ExtArgs> | null;
    include?: Prisma.BikeUnitInclude<ExtArgs> | null;
    where?: Prisma.BikeUnitWhereInput;
    orderBy?: Prisma.BikeUnitOrderByWithRelationInput | Prisma.BikeUnitOrderByWithRelationInput[];
    cursor?: Prisma.BikeUnitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BikeUnitScalarFieldEnum | Prisma.BikeUnitScalarFieldEnum[];
};
export type VendorAllocation$partLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VendorAllocation$recordedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type VendorAllocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
};
