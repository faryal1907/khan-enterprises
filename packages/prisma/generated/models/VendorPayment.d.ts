import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorPaymentModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorPaymentPayload>;
export type AggregateVendorPayment = {
    _count: VendorPaymentCountAggregateOutputType | null;
    _avg: VendorPaymentAvgAggregateOutputType | null;
    _sum: VendorPaymentSumAggregateOutputType | null;
    _min: VendorPaymentMinAggregateOutputType | null;
    _max: VendorPaymentMaxAggregateOutputType | null;
};
export type VendorPaymentAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type VendorPaymentSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type VendorPaymentMinAggregateOutputType = {
    id: string | null;
    vendorId: string | null;
    fromAccountId: string | null;
    amount: runtime.Decimal | null;
    date: Date | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorPaymentMaxAggregateOutputType = {
    id: string | null;
    vendorId: string | null;
    fromAccountId: string | null;
    amount: runtime.Decimal | null;
    date: Date | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorPaymentCountAggregateOutputType = {
    id: number;
    vendorId: number;
    fromAccountId: number;
    amount: number;
    date: number;
    notes: number;
    journalEntryId: number;
    recordedById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type VendorPaymentAvgAggregateInputType = {
    amount?: true;
};
export type VendorPaymentSumAggregateInputType = {
    amount?: true;
};
export type VendorPaymentMinAggregateInputType = {
    id?: true;
    vendorId?: true;
    fromAccountId?: true;
    amount?: true;
    date?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorPaymentMaxAggregateInputType = {
    id?: true;
    vendorId?: true;
    fromAccountId?: true;
    amount?: true;
    date?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorPaymentCountAggregateInputType = {
    id?: true;
    vendorId?: true;
    fromAccountId?: true;
    amount?: true;
    date?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type VendorPaymentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorPaymentWhereInput;
    orderBy?: Prisma.VendorPaymentOrderByWithRelationInput | Prisma.VendorPaymentOrderByWithRelationInput[];
    cursor?: Prisma.VendorPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorPaymentCountAggregateInputType;
    _avg?: VendorPaymentAvgAggregateInputType;
    _sum?: VendorPaymentSumAggregateInputType;
    _min?: VendorPaymentMinAggregateInputType;
    _max?: VendorPaymentMaxAggregateInputType;
};
export type GetVendorPaymentAggregateType<T extends VendorPaymentAggregateArgs> = {
    [P in keyof T & keyof AggregateVendorPayment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendorPayment[P]> : Prisma.GetScalarType<T[P], AggregateVendorPayment[P]>;
};
export type VendorPaymentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorPaymentWhereInput;
    orderBy?: Prisma.VendorPaymentOrderByWithAggregationInput | Prisma.VendorPaymentOrderByWithAggregationInput[];
    by: Prisma.VendorPaymentScalarFieldEnum[] | Prisma.VendorPaymentScalarFieldEnum;
    having?: Prisma.VendorPaymentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorPaymentCountAggregateInputType | true;
    _avg?: VendorPaymentAvgAggregateInputType;
    _sum?: VendorPaymentSumAggregateInputType;
    _min?: VendorPaymentMinAggregateInputType;
    _max?: VendorPaymentMaxAggregateInputType;
};
export type VendorPaymentGroupByOutputType = {
    id: string;
    vendorId: string;
    fromAccountId: string;
    amount: runtime.Decimal;
    date: Date;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorPaymentCountAggregateOutputType | null;
    _avg: VendorPaymentAvgAggregateOutputType | null;
    _sum: VendorPaymentSumAggregateOutputType | null;
    _min: VendorPaymentMinAggregateOutputType | null;
    _max: VendorPaymentMaxAggregateOutputType | null;
};
export type GetVendorPaymentGroupByPayload<T extends VendorPaymentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorPaymentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorPaymentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorPaymentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorPaymentGroupByOutputType[P]>;
}>>;
export type VendorPaymentWhereInput = {
    AND?: Prisma.VendorPaymentWhereInput | Prisma.VendorPaymentWhereInput[];
    OR?: Prisma.VendorPaymentWhereInput[];
    NOT?: Prisma.VendorPaymentWhereInput | Prisma.VendorPaymentWhereInput[];
    id?: Prisma.StringFilter<"VendorPayment"> | string;
    vendorId?: Prisma.StringFilter<"VendorPayment"> | string;
    fromAccountId?: Prisma.StringFilter<"VendorPayment"> | string;
    amount?: Prisma.DecimalFilter<"VendorPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    vendor?: Prisma.XOR<Prisma.VendorScalarRelationFilter, Prisma.VendorWhereInput>;
    fromAccount?: Prisma.XOR<Prisma.AccountScalarRelationFilter, Prisma.AccountWhereInput>;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type VendorPaymentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    fromAccountId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    vendor?: Prisma.VendorOrderByWithRelationInput;
    fromAccount?: Prisma.AccountOrderByWithRelationInput;
    journalEntry?: Prisma.JournalEntryOrderByWithRelationInput;
    recordedBy?: Prisma.UserOrderByWithRelationInput;
};
export type VendorPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    journalEntryId?: string;
    AND?: Prisma.VendorPaymentWhereInput | Prisma.VendorPaymentWhereInput[];
    OR?: Prisma.VendorPaymentWhereInput[];
    NOT?: Prisma.VendorPaymentWhereInput | Prisma.VendorPaymentWhereInput[];
    vendorId?: Prisma.StringFilter<"VendorPayment"> | string;
    fromAccountId?: Prisma.StringFilter<"VendorPayment"> | string;
    amount?: Prisma.DecimalFilter<"VendorPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    vendor?: Prisma.XOR<Prisma.VendorScalarRelationFilter, Prisma.VendorWhereInput>;
    fromAccount?: Prisma.XOR<Prisma.AccountScalarRelationFilter, Prisma.AccountWhereInput>;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "journalEntryId">;
export type VendorPaymentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    fromAccountId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VendorPaymentCountOrderByAggregateInput;
    _avg?: Prisma.VendorPaymentAvgOrderByAggregateInput;
    _max?: Prisma.VendorPaymentMaxOrderByAggregateInput;
    _min?: Prisma.VendorPaymentMinOrderByAggregateInput;
    _sum?: Prisma.VendorPaymentSumOrderByAggregateInput;
};
export type VendorPaymentScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorPaymentScalarWhereWithAggregatesInput | Prisma.VendorPaymentScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorPaymentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorPaymentScalarWhereWithAggregatesInput | Prisma.VendorPaymentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VendorPayment"> | string;
    vendorId?: Prisma.StringWithAggregatesFilter<"VendorPayment"> | string;
    fromAccountId?: Prisma.StringWithAggregatesFilter<"VendorPayment"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"VendorPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"VendorPayment"> | Date | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"VendorPayment"> | string | null;
    journalEntryId?: Prisma.StringNullableWithAggregatesFilter<"VendorPayment"> | string | null;
    recordedById?: Prisma.StringNullableWithAggregatesFilter<"VendorPayment"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"VendorPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"VendorPayment"> | Date | string;
};
export type VendorPaymentCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutPaymentsInput;
    fromAccount: Prisma.AccountCreateNestedOneWithoutVendorPaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorPaymentInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorPaymentsRecordedInput;
};
export type VendorPaymentUncheckedCreateInput = {
    id?: string;
    vendorId: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutPaymentsNestedInput;
    fromAccount?: Prisma.AccountUpdateOneRequiredWithoutVendorPaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorPaymentNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorPaymentsRecordedNestedInput;
};
export type VendorPaymentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentCreateManyInput = {
    id?: string;
    vendorId: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentListRelationFilter = {
    every?: Prisma.VendorPaymentWhereInput;
    some?: Prisma.VendorPaymentWhereInput;
    none?: Prisma.VendorPaymentWhereInput;
};
export type VendorPaymentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VendorPaymentNullableScalarRelationFilter = {
    is?: Prisma.VendorPaymentWhereInput | null;
    isNot?: Prisma.VendorPaymentWhereInput | null;
};
export type VendorPaymentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    fromAccountId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorPaymentAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type VendorPaymentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    fromAccountId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorPaymentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    fromAccountId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorPaymentSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type VendorPaymentCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput> | Prisma.VendorPaymentCreateWithoutRecordedByInput[] | Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput | Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.VendorPaymentCreateManyRecordedByInputEnvelope;
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
};
export type VendorPaymentUncheckedCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput> | Prisma.VendorPaymentCreateWithoutRecordedByInput[] | Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput | Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.VendorPaymentCreateManyRecordedByInputEnvelope;
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
};
export type VendorPaymentUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput> | Prisma.VendorPaymentCreateWithoutRecordedByInput[] | Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput | Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.VendorPaymentUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.VendorPaymentUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.VendorPaymentCreateManyRecordedByInputEnvelope;
    set?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    disconnect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    delete?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    update?: Prisma.VendorPaymentUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.VendorPaymentUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.VendorPaymentUpdateManyWithWhereWithoutRecordedByInput | Prisma.VendorPaymentUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
};
export type VendorPaymentUncheckedUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput> | Prisma.VendorPaymentCreateWithoutRecordedByInput[] | Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput | Prisma.VendorPaymentCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.VendorPaymentUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.VendorPaymentUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.VendorPaymentCreateManyRecordedByInputEnvelope;
    set?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    disconnect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    delete?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    update?: Prisma.VendorPaymentUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.VendorPaymentUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.VendorPaymentUpdateManyWithWhereWithoutRecordedByInput | Prisma.VendorPaymentUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
};
export type VendorPaymentCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutVendorInput, Prisma.VendorPaymentUncheckedCreateWithoutVendorInput> | Prisma.VendorPaymentCreateWithoutVendorInput[] | Prisma.VendorPaymentUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutVendorInput | Prisma.VendorPaymentCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.VendorPaymentCreateManyVendorInputEnvelope;
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
};
export type VendorPaymentUncheckedCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutVendorInput, Prisma.VendorPaymentUncheckedCreateWithoutVendorInput> | Prisma.VendorPaymentCreateWithoutVendorInput[] | Prisma.VendorPaymentUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutVendorInput | Prisma.VendorPaymentCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.VendorPaymentCreateManyVendorInputEnvelope;
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
};
export type VendorPaymentUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutVendorInput, Prisma.VendorPaymentUncheckedCreateWithoutVendorInput> | Prisma.VendorPaymentCreateWithoutVendorInput[] | Prisma.VendorPaymentUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutVendorInput | Prisma.VendorPaymentCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.VendorPaymentUpsertWithWhereUniqueWithoutVendorInput | Prisma.VendorPaymentUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.VendorPaymentCreateManyVendorInputEnvelope;
    set?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    disconnect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    delete?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    update?: Prisma.VendorPaymentUpdateWithWhereUniqueWithoutVendorInput | Prisma.VendorPaymentUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.VendorPaymentUpdateManyWithWhereWithoutVendorInput | Prisma.VendorPaymentUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
};
export type VendorPaymentUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutVendorInput, Prisma.VendorPaymentUncheckedCreateWithoutVendorInput> | Prisma.VendorPaymentCreateWithoutVendorInput[] | Prisma.VendorPaymentUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutVendorInput | Prisma.VendorPaymentCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.VendorPaymentUpsertWithWhereUniqueWithoutVendorInput | Prisma.VendorPaymentUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.VendorPaymentCreateManyVendorInputEnvelope;
    set?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    disconnect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    delete?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    update?: Prisma.VendorPaymentUpdateWithWhereUniqueWithoutVendorInput | Prisma.VendorPaymentUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.VendorPaymentUpdateManyWithWhereWithoutVendorInput | Prisma.VendorPaymentUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
};
export type VendorPaymentCreateNestedManyWithoutFromAccountInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput> | Prisma.VendorPaymentCreateWithoutFromAccountInput[] | Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput | Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput[];
    createMany?: Prisma.VendorPaymentCreateManyFromAccountInputEnvelope;
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
};
export type VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput> | Prisma.VendorPaymentCreateWithoutFromAccountInput[] | Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput | Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput[];
    createMany?: Prisma.VendorPaymentCreateManyFromAccountInputEnvelope;
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
};
export type VendorPaymentUpdateManyWithoutFromAccountNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput> | Prisma.VendorPaymentCreateWithoutFromAccountInput[] | Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput | Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput[];
    upsert?: Prisma.VendorPaymentUpsertWithWhereUniqueWithoutFromAccountInput | Prisma.VendorPaymentUpsertWithWhereUniqueWithoutFromAccountInput[];
    createMany?: Prisma.VendorPaymentCreateManyFromAccountInputEnvelope;
    set?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    disconnect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    delete?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    update?: Prisma.VendorPaymentUpdateWithWhereUniqueWithoutFromAccountInput | Prisma.VendorPaymentUpdateWithWhereUniqueWithoutFromAccountInput[];
    updateMany?: Prisma.VendorPaymentUpdateManyWithWhereWithoutFromAccountInput | Prisma.VendorPaymentUpdateManyWithWhereWithoutFromAccountInput[];
    deleteMany?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
};
export type VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput> | Prisma.VendorPaymentCreateWithoutFromAccountInput[] | Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput[];
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput | Prisma.VendorPaymentCreateOrConnectWithoutFromAccountInput[];
    upsert?: Prisma.VendorPaymentUpsertWithWhereUniqueWithoutFromAccountInput | Prisma.VendorPaymentUpsertWithWhereUniqueWithoutFromAccountInput[];
    createMany?: Prisma.VendorPaymentCreateManyFromAccountInputEnvelope;
    set?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    disconnect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    delete?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    connect?: Prisma.VendorPaymentWhereUniqueInput | Prisma.VendorPaymentWhereUniqueInput[];
    update?: Prisma.VendorPaymentUpdateWithWhereUniqueWithoutFromAccountInput | Prisma.VendorPaymentUpdateWithWhereUniqueWithoutFromAccountInput[];
    updateMany?: Prisma.VendorPaymentUpdateManyWithWhereWithoutFromAccountInput | Prisma.VendorPaymentUpdateManyWithWhereWithoutFromAccountInput[];
    deleteMany?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
};
export type VendorPaymentCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.VendorPaymentWhereUniqueInput;
};
export type VendorPaymentUncheckedCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.VendorPaymentWhereUniqueInput;
};
export type VendorPaymentUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.VendorPaymentUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.VendorPaymentWhereInput | boolean;
    delete?: Prisma.VendorPaymentWhereInput | boolean;
    connect?: Prisma.VendorPaymentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorPaymentUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.VendorPaymentUpdateWithoutJournalEntryInput>, Prisma.VendorPaymentUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorPaymentUncheckedUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.VendorPaymentCreateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.VendorPaymentCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.VendorPaymentUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.VendorPaymentWhereInput | boolean;
    delete?: Prisma.VendorPaymentWhereInput | boolean;
    connect?: Prisma.VendorPaymentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorPaymentUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.VendorPaymentUpdateWithoutJournalEntryInput>, Prisma.VendorPaymentUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorPaymentCreateWithoutRecordedByInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutPaymentsInput;
    fromAccount: Prisma.AccountCreateNestedOneWithoutVendorPaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorPaymentInput;
};
export type VendorPaymentUncheckedCreateWithoutRecordedByInput = {
    id?: string;
    vendorId: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentCreateOrConnectWithoutRecordedByInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput>;
};
export type VendorPaymentCreateManyRecordedByInputEnvelope = {
    data: Prisma.VendorPaymentCreateManyRecordedByInput | Prisma.VendorPaymentCreateManyRecordedByInput[];
    skipDuplicates?: boolean;
};
export type VendorPaymentUpsertWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedUpdateWithoutRecordedByInput>;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedCreateWithoutRecordedByInput>;
};
export type VendorPaymentUpdateWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutRecordedByInput, Prisma.VendorPaymentUncheckedUpdateWithoutRecordedByInput>;
};
export type VendorPaymentUpdateManyWithWhereWithoutRecordedByInput = {
    where: Prisma.VendorPaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateManyMutationInput, Prisma.VendorPaymentUncheckedUpdateManyWithoutRecordedByInput>;
};
export type VendorPaymentScalarWhereInput = {
    AND?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
    OR?: Prisma.VendorPaymentScalarWhereInput[];
    NOT?: Prisma.VendorPaymentScalarWhereInput | Prisma.VendorPaymentScalarWhereInput[];
    id?: Prisma.StringFilter<"VendorPayment"> | string;
    vendorId?: Prisma.StringFilter<"VendorPayment"> | string;
    fromAccountId?: Prisma.StringFilter<"VendorPayment"> | string;
    amount?: Prisma.DecimalFilter<"VendorPayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    notes?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"VendorPayment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VendorPayment"> | Date | string;
};
export type VendorPaymentCreateWithoutVendorInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    fromAccount: Prisma.AccountCreateNestedOneWithoutVendorPaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorPaymentInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorPaymentsRecordedInput;
};
export type VendorPaymentUncheckedCreateWithoutVendorInput = {
    id?: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentCreateOrConnectWithoutVendorInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutVendorInput, Prisma.VendorPaymentUncheckedCreateWithoutVendorInput>;
};
export type VendorPaymentCreateManyVendorInputEnvelope = {
    data: Prisma.VendorPaymentCreateManyVendorInput | Prisma.VendorPaymentCreateManyVendorInput[];
    skipDuplicates?: boolean;
};
export type VendorPaymentUpsertWithWhereUniqueWithoutVendorInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutVendorInput, Prisma.VendorPaymentUncheckedUpdateWithoutVendorInput>;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutVendorInput, Prisma.VendorPaymentUncheckedCreateWithoutVendorInput>;
};
export type VendorPaymentUpdateWithWhereUniqueWithoutVendorInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutVendorInput, Prisma.VendorPaymentUncheckedUpdateWithoutVendorInput>;
};
export type VendorPaymentUpdateManyWithWhereWithoutVendorInput = {
    where: Prisma.VendorPaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateManyMutationInput, Prisma.VendorPaymentUncheckedUpdateManyWithoutVendorInput>;
};
export type VendorPaymentCreateWithoutFromAccountInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutPaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutVendorPaymentInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorPaymentsRecordedInput;
};
export type VendorPaymentUncheckedCreateWithoutFromAccountInput = {
    id?: string;
    vendorId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentCreateOrConnectWithoutFromAccountInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput>;
};
export type VendorPaymentCreateManyFromAccountInputEnvelope = {
    data: Prisma.VendorPaymentCreateManyFromAccountInput | Prisma.VendorPaymentCreateManyFromAccountInput[];
    skipDuplicates?: boolean;
};
export type VendorPaymentUpsertWithWhereUniqueWithoutFromAccountInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedUpdateWithoutFromAccountInput>;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedCreateWithoutFromAccountInput>;
};
export type VendorPaymentUpdateWithWhereUniqueWithoutFromAccountInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutFromAccountInput, Prisma.VendorPaymentUncheckedUpdateWithoutFromAccountInput>;
};
export type VendorPaymentUpdateManyWithWhereWithoutFromAccountInput = {
    where: Prisma.VendorPaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateManyMutationInput, Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountInput>;
};
export type VendorPaymentCreateWithoutJournalEntryInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: Prisma.VendorCreateNestedOneWithoutPaymentsInput;
    fromAccount: Prisma.AccountCreateNestedOneWithoutVendorPaymentsInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutVendorPaymentsRecordedInput;
};
export type VendorPaymentUncheckedCreateWithoutJournalEntryInput = {
    id?: string;
    vendorId: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentCreateOrConnectWithoutJournalEntryInput = {
    where: Prisma.VendorPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedCreateWithoutJournalEntryInput>;
};
export type VendorPaymentUpsertWithoutJournalEntryInput = {
    update: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedUpdateWithoutJournalEntryInput>;
    create: Prisma.XOR<Prisma.VendorPaymentCreateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedCreateWithoutJournalEntryInput>;
    where?: Prisma.VendorPaymentWhereInput;
};
export type VendorPaymentUpdateToOneWithWhereWithoutJournalEntryInput = {
    where?: Prisma.VendorPaymentWhereInput;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateWithoutJournalEntryInput, Prisma.VendorPaymentUncheckedUpdateWithoutJournalEntryInput>;
};
export type VendorPaymentUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutPaymentsNestedInput;
    fromAccount?: Prisma.AccountUpdateOneRequiredWithoutVendorPaymentsNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorPaymentsRecordedNestedInput;
};
export type VendorPaymentUncheckedUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentCreateManyRecordedByInput = {
    id?: string;
    vendorId: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutPaymentsNestedInput;
    fromAccount?: Prisma.AccountUpdateOneRequiredWithoutVendorPaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorPaymentNestedInput;
};
export type VendorPaymentUncheckedUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentUncheckedUpdateManyWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentCreateManyVendorInput = {
    id?: string;
    fromAccountId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fromAccount?: Prisma.AccountUpdateOneRequiredWithoutVendorPaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorPaymentNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorPaymentsRecordedNestedInput;
};
export type VendorPaymentUncheckedUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentUncheckedUpdateManyWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromAccountId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentCreateManyFromAccountInput = {
    id?: string;
    vendorId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Date | string;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorPaymentUpdateWithoutFromAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneRequiredWithoutPaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutVendorPaymentNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutVendorPaymentsRecordedNestedInput;
};
export type VendorPaymentUncheckedUpdateWithoutFromAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentUncheckedUpdateManyWithoutFromAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorPaymentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vendorId?: boolean;
    fromAccountId?: boolean;
    amount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    fromAccount?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorPayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorPayment$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorPayment"]>;
export type VendorPaymentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vendorId?: boolean;
    fromAccountId?: boolean;
    amount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    fromAccount?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorPayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorPayment$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorPayment"]>;
export type VendorPaymentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vendorId?: boolean;
    fromAccountId?: boolean;
    amount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    fromAccount?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorPayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorPayment$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["vendorPayment"]>;
export type VendorPaymentSelectScalar = {
    id?: boolean;
    vendorId?: boolean;
    fromAccountId?: boolean;
    amount?: boolean;
    date?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type VendorPaymentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "vendorId" | "fromAccountId" | "amount" | "date" | "notes" | "journalEntryId" | "recordedById" | "createdAt" | "updatedAt", ExtArgs["result"]["vendorPayment"]>;
export type VendorPaymentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    fromAccount?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorPayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorPayment$recordedByArgs<ExtArgs>;
};
export type VendorPaymentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    fromAccount?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorPayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorPayment$recordedByArgs<ExtArgs>;
};
export type VendorPaymentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vendor?: boolean | Prisma.VendorDefaultArgs<ExtArgs>;
    fromAccount?: boolean | Prisma.AccountDefaultArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.VendorPayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.VendorPayment$recordedByArgs<ExtArgs>;
};
export type $VendorPaymentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VendorPayment";
    objects: {
        vendor: Prisma.$VendorPayload<ExtArgs>;
        fromAccount: Prisma.$AccountPayload<ExtArgs>;
        journalEntry: Prisma.$JournalEntryPayload<ExtArgs> | null;
        recordedBy: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        vendorId: string;
        fromAccountId: string;
        amount: runtime.Decimal;
        date: Date;
        notes: string | null;
        journalEntryId: string | null;
        recordedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["vendorPayment"]>;
    composites: {};
};
export type VendorPaymentGetPayload<S extends boolean | null | undefined | VendorPaymentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload, S>;
export type VendorPaymentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorPaymentCountAggregateInputType | true;
};
export interface VendorPaymentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VendorPayment'];
        meta: {
            name: 'VendorPayment';
        };
    };
    findUnique<T extends VendorPaymentFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorPaymentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorPaymentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorPaymentFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorPaymentFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorPaymentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorPaymentFindManyArgs>(args?: Prisma.SelectSubset<T, VendorPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorPaymentCreateArgs>(args: Prisma.SelectSubset<T, VendorPaymentCreateArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorPaymentCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorPaymentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorPaymentDeleteArgs>(args: Prisma.SelectSubset<T, VendorPaymentDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorPaymentUpdateArgs>(args: Prisma.SelectSubset<T, VendorPaymentUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorPaymentDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorPaymentUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorPaymentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorPaymentUpsertArgs>(args: Prisma.SelectSubset<T, VendorPaymentUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorPaymentCountArgs>(args?: Prisma.Subset<T, VendorPaymentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorPaymentCountAggregateOutputType> : number>;
    aggregate<T extends VendorPaymentAggregateArgs>(args: Prisma.Subset<T, VendorPaymentAggregateArgs>): Prisma.PrismaPromise<GetVendorPaymentAggregateType<T>>;
    groupBy<T extends VendorPaymentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorPaymentGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorPaymentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorPaymentFieldRefs;
}
export interface Prisma__VendorPaymentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    vendor<T extends Prisma.VendorDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorDefaultArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    fromAccount<T extends Prisma.AccountDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AccountDefaultArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    journalEntry<T extends Prisma.VendorPayment$journalEntryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorPayment$journalEntryArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    recordedBy<T extends Prisma.VendorPayment$recordedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VendorPayment$recordedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorPaymentFieldRefs {
    readonly id: Prisma.FieldRef<"VendorPayment", 'String'>;
    readonly vendorId: Prisma.FieldRef<"VendorPayment", 'String'>;
    readonly fromAccountId: Prisma.FieldRef<"VendorPayment", 'String'>;
    readonly amount: Prisma.FieldRef<"VendorPayment", 'Decimal'>;
    readonly date: Prisma.FieldRef<"VendorPayment", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"VendorPayment", 'String'>;
    readonly journalEntryId: Prisma.FieldRef<"VendorPayment", 'String'>;
    readonly recordedById: Prisma.FieldRef<"VendorPayment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"VendorPayment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"VendorPayment", 'DateTime'>;
}
export type VendorPaymentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where: Prisma.VendorPaymentWhereUniqueInput;
};
export type VendorPaymentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where: Prisma.VendorPaymentWhereUniqueInput;
};
export type VendorPaymentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where?: Prisma.VendorPaymentWhereInput;
    orderBy?: Prisma.VendorPaymentOrderByWithRelationInput | Prisma.VendorPaymentOrderByWithRelationInput[];
    cursor?: Prisma.VendorPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorPaymentScalarFieldEnum | Prisma.VendorPaymentScalarFieldEnum[];
};
export type VendorPaymentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where?: Prisma.VendorPaymentWhereInput;
    orderBy?: Prisma.VendorPaymentOrderByWithRelationInput | Prisma.VendorPaymentOrderByWithRelationInput[];
    cursor?: Prisma.VendorPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorPaymentScalarFieldEnum | Prisma.VendorPaymentScalarFieldEnum[];
};
export type VendorPaymentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where?: Prisma.VendorPaymentWhereInput;
    orderBy?: Prisma.VendorPaymentOrderByWithRelationInput | Prisma.VendorPaymentOrderByWithRelationInput[];
    cursor?: Prisma.VendorPaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorPaymentScalarFieldEnum | Prisma.VendorPaymentScalarFieldEnum[];
};
export type VendorPaymentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorPaymentCreateInput, Prisma.VendorPaymentUncheckedCreateInput>;
};
export type VendorPaymentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorPaymentCreateManyInput | Prisma.VendorPaymentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorPaymentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    data: Prisma.VendorPaymentCreateManyInput | Prisma.VendorPaymentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VendorPaymentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VendorPaymentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateInput, Prisma.VendorPaymentUncheckedUpdateInput>;
    where: Prisma.VendorPaymentWhereUniqueInput;
};
export type VendorPaymentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorPaymentUpdateManyMutationInput, Prisma.VendorPaymentUncheckedUpdateManyInput>;
    where?: Prisma.VendorPaymentWhereInput;
    limit?: number;
};
export type VendorPaymentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorPaymentUpdateManyMutationInput, Prisma.VendorPaymentUncheckedUpdateManyInput>;
    where?: Prisma.VendorPaymentWhereInput;
    limit?: number;
    include?: Prisma.VendorPaymentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VendorPaymentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where: Prisma.VendorPaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorPaymentCreateInput, Prisma.VendorPaymentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorPaymentUpdateInput, Prisma.VendorPaymentUncheckedUpdateInput>;
};
export type VendorPaymentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where: Prisma.VendorPaymentWhereUniqueInput;
};
export type VendorPaymentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorPaymentWhereInput;
    limit?: number;
};
export type VendorPayment$journalEntryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
};
export type VendorPayment$recordedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type VendorPaymentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
};
