import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type ReceivablePaymentModel = runtime.Types.Result.DefaultSelection<Prisma.$ReceivablePaymentPayload>;
export type AggregateReceivablePayment = {
    _count: ReceivablePaymentCountAggregateOutputType | null;
    _avg: ReceivablePaymentAvgAggregateOutputType | null;
    _sum: ReceivablePaymentSumAggregateOutputType | null;
    _min: ReceivablePaymentMinAggregateOutputType | null;
    _max: ReceivablePaymentMaxAggregateOutputType | null;
};
export type ReceivablePaymentAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type ReceivablePaymentSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type ReceivablePaymentMinAggregateOutputType = {
    id: string | null;
    entryId: string | null;
    amount: runtime.Decimal | null;
    method: $Enums.PaymentMethod | null;
    accountId: string | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    collectedAt: Date | null;
    createdAt: Date | null;
};
export type ReceivablePaymentMaxAggregateOutputType = {
    id: string | null;
    entryId: string | null;
    amount: runtime.Decimal | null;
    method: $Enums.PaymentMethod | null;
    accountId: string | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    collectedAt: Date | null;
    createdAt: Date | null;
};
export type ReceivablePaymentCountAggregateOutputType = {
    id: number;
    entryId: number;
    amount: number;
    method: number;
    accountId: number;
    notes: number;
    journalEntryId: number;
    recordedById: number;
    collectedAt: number;
    createdAt: number;
    _all: number;
};
export type ReceivablePaymentAvgAggregateInputType = {
    amount?: true;
};
export type ReceivablePaymentSumAggregateInputType = {
    amount?: true;
};
export type ReceivablePaymentMinAggregateInputType = {
    id?: true;
    entryId?: true;
    amount?: true;
    method?: true;
    accountId?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    collectedAt?: true;
    createdAt?: true;
};
export type ReceivablePaymentMaxAggregateInputType = {
    id?: true;
    entryId?: true;
    amount?: true;
    method?: true;
    accountId?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    collectedAt?: true;
    createdAt?: true;
};
export type ReceivablePaymentCountAggregateInputType = {
    id?: true;
    entryId?: true;
    amount?: true;
    method?: true;
    accountId?: true;
    notes?: true;
    journalEntryId?: true;
    recordedById?: true;
    collectedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ReceivablePaymentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePaymentWhereInput;
    orderBy?: Prisma.ReceivablePaymentOrderByWithRelationInput | Prisma.ReceivablePaymentOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReceivablePaymentCountAggregateInputType;
    _avg?: ReceivablePaymentAvgAggregateInputType;
    _sum?: ReceivablePaymentSumAggregateInputType;
    _min?: ReceivablePaymentMinAggregateInputType;
    _max?: ReceivablePaymentMaxAggregateInputType;
};
export type GetReceivablePaymentAggregateType<T extends ReceivablePaymentAggregateArgs> = {
    [P in keyof T & keyof AggregateReceivablePayment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReceivablePayment[P]> : Prisma.GetScalarType<T[P], AggregateReceivablePayment[P]>;
};
export type ReceivablePaymentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePaymentWhereInput;
    orderBy?: Prisma.ReceivablePaymentOrderByWithAggregationInput | Prisma.ReceivablePaymentOrderByWithAggregationInput[];
    by: Prisma.ReceivablePaymentScalarFieldEnum[] | Prisma.ReceivablePaymentScalarFieldEnum;
    having?: Prisma.ReceivablePaymentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReceivablePaymentCountAggregateInputType | true;
    _avg?: ReceivablePaymentAvgAggregateInputType;
    _sum?: ReceivablePaymentSumAggregateInputType;
    _min?: ReceivablePaymentMinAggregateInputType;
    _max?: ReceivablePaymentMaxAggregateInputType;
};
export type ReceivablePaymentGroupByOutputType = {
    id: string;
    entryId: string;
    amount: runtime.Decimal;
    method: $Enums.PaymentMethod;
    accountId: string | null;
    notes: string | null;
    journalEntryId: string | null;
    recordedById: string | null;
    collectedAt: Date;
    createdAt: Date;
    _count: ReceivablePaymentCountAggregateOutputType | null;
    _avg: ReceivablePaymentAvgAggregateOutputType | null;
    _sum: ReceivablePaymentSumAggregateOutputType | null;
    _min: ReceivablePaymentMinAggregateOutputType | null;
    _max: ReceivablePaymentMaxAggregateOutputType | null;
};
export type GetReceivablePaymentGroupByPayload<T extends ReceivablePaymentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReceivablePaymentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReceivablePaymentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReceivablePaymentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReceivablePaymentGroupByOutputType[P]>;
}>>;
export type ReceivablePaymentWhereInput = {
    AND?: Prisma.ReceivablePaymentWhereInput | Prisma.ReceivablePaymentWhereInput[];
    OR?: Prisma.ReceivablePaymentWhereInput[];
    NOT?: Prisma.ReceivablePaymentWhereInput | Prisma.ReceivablePaymentWhereInput[];
    id?: Prisma.StringFilter<"ReceivablePayment"> | string;
    entryId?: Prisma.StringFilter<"ReceivablePayment"> | string;
    amount?: Prisma.DecimalFilter<"ReceivablePayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFilter<"ReceivablePayment"> | $Enums.PaymentMethod;
    accountId?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    notes?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    collectedAt?: Prisma.DateTimeFilter<"ReceivablePayment"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ReceivablePayment"> | Date | string;
    entry?: Prisma.XOR<Prisma.ReceivableEntryScalarRelationFilter, Prisma.ReceivableEntryWhereInput>;
    account?: Prisma.XOR<Prisma.AccountNullableScalarRelationFilter, Prisma.AccountWhereInput> | null;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type ReceivablePaymentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    entryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    accountId?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    collectedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    entry?: Prisma.ReceivableEntryOrderByWithRelationInput;
    account?: Prisma.AccountOrderByWithRelationInput;
    journalEntry?: Prisma.JournalEntryOrderByWithRelationInput;
    recordedBy?: Prisma.UserOrderByWithRelationInput;
};
export type ReceivablePaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    journalEntryId?: string;
    AND?: Prisma.ReceivablePaymentWhereInput | Prisma.ReceivablePaymentWhereInput[];
    OR?: Prisma.ReceivablePaymentWhereInput[];
    NOT?: Prisma.ReceivablePaymentWhereInput | Prisma.ReceivablePaymentWhereInput[];
    entryId?: Prisma.StringFilter<"ReceivablePayment"> | string;
    amount?: Prisma.DecimalFilter<"ReceivablePayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFilter<"ReceivablePayment"> | $Enums.PaymentMethod;
    accountId?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    notes?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    collectedAt?: Prisma.DateTimeFilter<"ReceivablePayment"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ReceivablePayment"> | Date | string;
    entry?: Prisma.XOR<Prisma.ReceivableEntryScalarRelationFilter, Prisma.ReceivableEntryWhereInput>;
    account?: Prisma.XOR<Prisma.AccountNullableScalarRelationFilter, Prisma.AccountWhereInput> | null;
    journalEntry?: Prisma.XOR<Prisma.JournalEntryNullableScalarRelationFilter, Prisma.JournalEntryWhereInput> | null;
    recordedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "journalEntryId">;
export type ReceivablePaymentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    entryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    accountId?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    collectedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ReceivablePaymentCountOrderByAggregateInput;
    _avg?: Prisma.ReceivablePaymentAvgOrderByAggregateInput;
    _max?: Prisma.ReceivablePaymentMaxOrderByAggregateInput;
    _min?: Prisma.ReceivablePaymentMinOrderByAggregateInput;
    _sum?: Prisma.ReceivablePaymentSumOrderByAggregateInput;
};
export type ReceivablePaymentScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReceivablePaymentScalarWhereWithAggregatesInput | Prisma.ReceivablePaymentScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReceivablePaymentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReceivablePaymentScalarWhereWithAggregatesInput | Prisma.ReceivablePaymentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ReceivablePayment"> | string;
    entryId?: Prisma.StringWithAggregatesFilter<"ReceivablePayment"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"ReceivablePayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodWithAggregatesFilter<"ReceivablePayment"> | $Enums.PaymentMethod;
    accountId?: Prisma.StringNullableWithAggregatesFilter<"ReceivablePayment"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"ReceivablePayment"> | string | null;
    journalEntryId?: Prisma.StringNullableWithAggregatesFilter<"ReceivablePayment"> | string | null;
    recordedById?: Prisma.StringNullableWithAggregatesFilter<"ReceivablePayment"> | string | null;
    collectedAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivablePayment"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivablePayment"> | Date | string;
};
export type ReceivablePaymentCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
    entry: Prisma.ReceivableEntryCreateNestedOneWithoutPaymentsInput;
    account?: Prisma.AccountCreateNestedOneWithoutReceivablePaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutReceivablePaymentInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutReceivablePaymentsRecordedInput;
};
export type ReceivablePaymentUncheckedCreateInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entry?: Prisma.ReceivableEntryUpdateOneRequiredWithoutPaymentsNestedInput;
    account?: Prisma.AccountUpdateOneWithoutReceivablePaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutReceivablePaymentNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutReceivablePaymentsRecordedNestedInput;
};
export type ReceivablePaymentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentCreateManyInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentListRelationFilter = {
    every?: Prisma.ReceivablePaymentWhereInput;
    some?: Prisma.ReceivablePaymentWhereInput;
    none?: Prisma.ReceivablePaymentWhereInput;
};
export type ReceivablePaymentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReceivablePaymentNullableScalarRelationFilter = {
    is?: Prisma.ReceivablePaymentWhereInput | null;
    isNot?: Prisma.ReceivablePaymentWhereInput | null;
};
export type ReceivablePaymentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    collectedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReceivablePaymentAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ReceivablePaymentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    collectedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReceivablePaymentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    accountId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    journalEntryId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    collectedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReceivablePaymentSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ReceivablePaymentCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput> | Prisma.ReceivablePaymentCreateWithoutRecordedByInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput | Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyRecordedByInputEnvelope;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
};
export type ReceivablePaymentUncheckedCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput> | Prisma.ReceivablePaymentCreateWithoutRecordedByInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput | Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyRecordedByInputEnvelope;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
};
export type ReceivablePaymentUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput> | Prisma.ReceivablePaymentCreateWithoutRecordedByInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput | Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyRecordedByInputEnvelope;
    set?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    disconnect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    delete?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    update?: Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.ReceivablePaymentUpdateManyWithWhereWithoutRecordedByInput | Prisma.ReceivablePaymentUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
};
export type ReceivablePaymentUncheckedUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput> | Prisma.ReceivablePaymentCreateWithoutRecordedByInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput | Prisma.ReceivablePaymentCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyRecordedByInputEnvelope;
    set?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    disconnect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    delete?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    update?: Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.ReceivablePaymentUpdateManyWithWhereWithoutRecordedByInput | Prisma.ReceivablePaymentUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
};
export type ReceivablePaymentCreateNestedManyWithoutAccountInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput> | Prisma.ReceivablePaymentCreateWithoutAccountInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput | Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyAccountInputEnvelope;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
};
export type ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput> | Prisma.ReceivablePaymentCreateWithoutAccountInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput | Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyAccountInputEnvelope;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
};
export type ReceivablePaymentUpdateManyWithoutAccountNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput> | Prisma.ReceivablePaymentCreateWithoutAccountInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput | Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput[];
    upsert?: Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutAccountInput | Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyAccountInputEnvelope;
    set?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    disconnect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    delete?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    update?: Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutAccountInput | Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?: Prisma.ReceivablePaymentUpdateManyWithWhereWithoutAccountInput | Prisma.ReceivablePaymentUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
};
export type ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput> | Prisma.ReceivablePaymentCreateWithoutAccountInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput | Prisma.ReceivablePaymentCreateOrConnectWithoutAccountInput[];
    upsert?: Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutAccountInput | Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyAccountInputEnvelope;
    set?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    disconnect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    delete?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    update?: Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutAccountInput | Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?: Prisma.ReceivablePaymentUpdateManyWithWhereWithoutAccountInput | Prisma.ReceivablePaymentUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
};
export type ReceivablePaymentCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput;
};
export type ReceivablePaymentUncheckedCreateNestedOneWithoutJournalEntryInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutJournalEntryInput;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput;
};
export type ReceivablePaymentUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.ReceivablePaymentUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.ReceivablePaymentWhereInput | boolean;
    delete?: Prisma.ReceivablePaymentWhereInput | boolean;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReceivablePaymentUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.ReceivablePaymentUpdateWithoutJournalEntryInput>, Prisma.ReceivablePaymentUncheckedUpdateWithoutJournalEntryInput>;
};
export type ReceivablePaymentUncheckedUpdateOneWithoutJournalEntryNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutJournalEntryInput>;
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutJournalEntryInput;
    upsert?: Prisma.ReceivablePaymentUpsertWithoutJournalEntryInput;
    disconnect?: Prisma.ReceivablePaymentWhereInput | boolean;
    delete?: Prisma.ReceivablePaymentWhereInput | boolean;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReceivablePaymentUpdateToOneWithWhereWithoutJournalEntryInput, Prisma.ReceivablePaymentUpdateWithoutJournalEntryInput>, Prisma.ReceivablePaymentUncheckedUpdateWithoutJournalEntryInput>;
};
export type ReceivablePaymentCreateNestedManyWithoutEntryInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput> | Prisma.ReceivablePaymentCreateWithoutEntryInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput | Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyEntryInputEnvelope;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
};
export type ReceivablePaymentUncheckedCreateNestedManyWithoutEntryInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput> | Prisma.ReceivablePaymentCreateWithoutEntryInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput | Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyEntryInputEnvelope;
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
};
export type ReceivablePaymentUpdateManyWithoutEntryNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput> | Prisma.ReceivablePaymentCreateWithoutEntryInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput | Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput[];
    upsert?: Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutEntryInput | Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutEntryInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyEntryInputEnvelope;
    set?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    disconnect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    delete?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    update?: Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutEntryInput | Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutEntryInput[];
    updateMany?: Prisma.ReceivablePaymentUpdateManyWithWhereWithoutEntryInput | Prisma.ReceivablePaymentUpdateManyWithWhereWithoutEntryInput[];
    deleteMany?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
};
export type ReceivablePaymentUncheckedUpdateManyWithoutEntryNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput> | Prisma.ReceivablePaymentCreateWithoutEntryInput[] | Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput[];
    connectOrCreate?: Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput | Prisma.ReceivablePaymentCreateOrConnectWithoutEntryInput[];
    upsert?: Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutEntryInput | Prisma.ReceivablePaymentUpsertWithWhereUniqueWithoutEntryInput[];
    createMany?: Prisma.ReceivablePaymentCreateManyEntryInputEnvelope;
    set?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    disconnect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    delete?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    connect?: Prisma.ReceivablePaymentWhereUniqueInput | Prisma.ReceivablePaymentWhereUniqueInput[];
    update?: Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutEntryInput | Prisma.ReceivablePaymentUpdateWithWhereUniqueWithoutEntryInput[];
    updateMany?: Prisma.ReceivablePaymentUpdateManyWithWhereWithoutEntryInput | Prisma.ReceivablePaymentUpdateManyWithWhereWithoutEntryInput[];
    deleteMany?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
};
export type ReceivablePaymentCreateWithoutRecordedByInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
    entry: Prisma.ReceivableEntryCreateNestedOneWithoutPaymentsInput;
    account?: Prisma.AccountCreateNestedOneWithoutReceivablePaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutReceivablePaymentInput;
};
export type ReceivablePaymentUncheckedCreateWithoutRecordedByInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    journalEntryId?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentCreateOrConnectWithoutRecordedByInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput>;
};
export type ReceivablePaymentCreateManyRecordedByInputEnvelope = {
    data: Prisma.ReceivablePaymentCreateManyRecordedByInput | Prisma.ReceivablePaymentCreateManyRecordedByInput[];
    skipDuplicates?: boolean;
};
export type ReceivablePaymentUpsertWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutRecordedByInput>;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedCreateWithoutRecordedByInput>;
};
export type ReceivablePaymentUpdateWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutRecordedByInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutRecordedByInput>;
};
export type ReceivablePaymentUpdateManyWithWhereWithoutRecordedByInput = {
    where: Prisma.ReceivablePaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateManyMutationInput, Prisma.ReceivablePaymentUncheckedUpdateManyWithoutRecordedByInput>;
};
export type ReceivablePaymentScalarWhereInput = {
    AND?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
    OR?: Prisma.ReceivablePaymentScalarWhereInput[];
    NOT?: Prisma.ReceivablePaymentScalarWhereInput | Prisma.ReceivablePaymentScalarWhereInput[];
    id?: Prisma.StringFilter<"ReceivablePayment"> | string;
    entryId?: Prisma.StringFilter<"ReceivablePayment"> | string;
    amount?: Prisma.DecimalFilter<"ReceivablePayment"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFilter<"ReceivablePayment"> | $Enums.PaymentMethod;
    accountId?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    notes?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    journalEntryId?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    recordedById?: Prisma.StringNullableFilter<"ReceivablePayment"> | string | null;
    collectedAt?: Prisma.DateTimeFilter<"ReceivablePayment"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ReceivablePayment"> | Date | string;
};
export type ReceivablePaymentCreateWithoutAccountInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
    entry: Prisma.ReceivableEntryCreateNestedOneWithoutPaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutReceivablePaymentInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutReceivablePaymentsRecordedInput;
};
export type ReceivablePaymentUncheckedCreateWithoutAccountInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentCreateOrConnectWithoutAccountInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput>;
};
export type ReceivablePaymentCreateManyAccountInputEnvelope = {
    data: Prisma.ReceivablePaymentCreateManyAccountInput | Prisma.ReceivablePaymentCreateManyAccountInput[];
    skipDuplicates?: boolean;
};
export type ReceivablePaymentUpsertWithWhereUniqueWithoutAccountInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutAccountInput>;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedCreateWithoutAccountInput>;
};
export type ReceivablePaymentUpdateWithWhereUniqueWithoutAccountInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutAccountInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutAccountInput>;
};
export type ReceivablePaymentUpdateManyWithWhereWithoutAccountInput = {
    where: Prisma.ReceivablePaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateManyMutationInput, Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountInput>;
};
export type ReceivablePaymentCreateWithoutJournalEntryInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
    entry: Prisma.ReceivableEntryCreateNestedOneWithoutPaymentsInput;
    account?: Prisma.AccountCreateNestedOneWithoutReceivablePaymentsInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutReceivablePaymentsRecordedInput;
};
export type ReceivablePaymentUncheckedCreateWithoutJournalEntryInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentCreateOrConnectWithoutJournalEntryInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutJournalEntryInput>;
};
export type ReceivablePaymentUpsertWithoutJournalEntryInput = {
    update: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutJournalEntryInput>;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutJournalEntryInput>;
    where?: Prisma.ReceivablePaymentWhereInput;
};
export type ReceivablePaymentUpdateToOneWithWhereWithoutJournalEntryInput = {
    where?: Prisma.ReceivablePaymentWhereInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutJournalEntryInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutJournalEntryInput>;
};
export type ReceivablePaymentUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entry?: Prisma.ReceivableEntryUpdateOneRequiredWithoutPaymentsNestedInput;
    account?: Prisma.AccountUpdateOneWithoutReceivablePaymentsNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutReceivablePaymentsRecordedNestedInput;
};
export type ReceivablePaymentUncheckedUpdateWithoutJournalEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentCreateWithoutEntryInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
    account?: Prisma.AccountCreateNestedOneWithoutReceivablePaymentsInput;
    journalEntry?: Prisma.JournalEntryCreateNestedOneWithoutReceivablePaymentInput;
    recordedBy?: Prisma.UserCreateNestedOneWithoutReceivablePaymentsRecordedInput;
};
export type ReceivablePaymentUncheckedCreateWithoutEntryInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentCreateOrConnectWithoutEntryInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput>;
};
export type ReceivablePaymentCreateManyEntryInputEnvelope = {
    data: Prisma.ReceivablePaymentCreateManyEntryInput | Prisma.ReceivablePaymentCreateManyEntryInput[];
    skipDuplicates?: boolean;
};
export type ReceivablePaymentUpsertWithWhereUniqueWithoutEntryInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutEntryInput>;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedCreateWithoutEntryInput>;
};
export type ReceivablePaymentUpdateWithWhereUniqueWithoutEntryInput = {
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateWithoutEntryInput, Prisma.ReceivablePaymentUncheckedUpdateWithoutEntryInput>;
};
export type ReceivablePaymentUpdateManyWithWhereWithoutEntryInput = {
    where: Prisma.ReceivablePaymentScalarWhereInput;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateManyMutationInput, Prisma.ReceivablePaymentUncheckedUpdateManyWithoutEntryInput>;
};
export type ReceivablePaymentCreateManyRecordedByInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    journalEntryId?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entry?: Prisma.ReceivableEntryUpdateOneRequiredWithoutPaymentsNestedInput;
    account?: Prisma.AccountUpdateOneWithoutReceivablePaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutReceivablePaymentNestedInput;
};
export type ReceivablePaymentUncheckedUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentUncheckedUpdateManyWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentCreateManyAccountInput = {
    id?: string;
    entryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentUpdateWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entry?: Prisma.ReceivableEntryUpdateOneRequiredWithoutPaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutReceivablePaymentNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutReceivablePaymentsRecordedNestedInput;
};
export type ReceivablePaymentUncheckedUpdateWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentUncheckedUpdateManyWithoutAccountInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentCreateManyEntryInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    accountId?: string | null;
    notes?: string | null;
    journalEntryId?: string | null;
    recordedById?: string | null;
    collectedAt?: Date | string;
    createdAt?: Date | string;
};
export type ReceivablePaymentUpdateWithoutEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    account?: Prisma.AccountUpdateOneWithoutReceivablePaymentsNestedInput;
    journalEntry?: Prisma.JournalEntryUpdateOneWithoutReceivablePaymentNestedInput;
    recordedBy?: Prisma.UserUpdateOneWithoutReceivablePaymentsRecordedNestedInput;
};
export type ReceivablePaymentUncheckedUpdateWithoutEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentUncheckedUpdateManyWithoutEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    accountId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    journalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    collectedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePaymentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entryId?: boolean;
    amount?: boolean;
    method?: boolean;
    accountId?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    collectedAt?: boolean;
    createdAt?: boolean;
    entry?: boolean | Prisma.ReceivableEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.ReceivablePayment$accountArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.ReceivablePayment$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["receivablePayment"]>;
export type ReceivablePaymentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entryId?: boolean;
    amount?: boolean;
    method?: boolean;
    accountId?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    collectedAt?: boolean;
    createdAt?: boolean;
    entry?: boolean | Prisma.ReceivableEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.ReceivablePayment$accountArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.ReceivablePayment$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["receivablePayment"]>;
export type ReceivablePaymentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entryId?: boolean;
    amount?: boolean;
    method?: boolean;
    accountId?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    collectedAt?: boolean;
    createdAt?: boolean;
    entry?: boolean | Prisma.ReceivableEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.ReceivablePayment$accountArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.ReceivablePayment$recordedByArgs<ExtArgs>;
}, ExtArgs["result"]["receivablePayment"]>;
export type ReceivablePaymentSelectScalar = {
    id?: boolean;
    entryId?: boolean;
    amount?: boolean;
    method?: boolean;
    accountId?: boolean;
    notes?: boolean;
    journalEntryId?: boolean;
    recordedById?: boolean;
    collectedAt?: boolean;
    createdAt?: boolean;
};
export type ReceivablePaymentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "entryId" | "amount" | "method" | "accountId" | "notes" | "journalEntryId" | "recordedById" | "collectedAt" | "createdAt", ExtArgs["result"]["receivablePayment"]>;
export type ReceivablePaymentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entry?: boolean | Prisma.ReceivableEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.ReceivablePayment$accountArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.ReceivablePayment$recordedByArgs<ExtArgs>;
};
export type ReceivablePaymentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entry?: boolean | Prisma.ReceivableEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.ReceivablePayment$accountArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.ReceivablePayment$recordedByArgs<ExtArgs>;
};
export type ReceivablePaymentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entry?: boolean | Prisma.ReceivableEntryDefaultArgs<ExtArgs>;
    account?: boolean | Prisma.ReceivablePayment$accountArgs<ExtArgs>;
    journalEntry?: boolean | Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.ReceivablePayment$recordedByArgs<ExtArgs>;
};
export type $ReceivablePaymentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReceivablePayment";
    objects: {
        entry: Prisma.$ReceivableEntryPayload<ExtArgs>;
        account: Prisma.$AccountPayload<ExtArgs> | null;
        journalEntry: Prisma.$JournalEntryPayload<ExtArgs> | null;
        recordedBy: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        entryId: string;
        amount: runtime.Decimal;
        method: $Enums.PaymentMethod;
        accountId: string | null;
        notes: string | null;
        journalEntryId: string | null;
        recordedById: string | null;
        collectedAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["receivablePayment"]>;
    composites: {};
};
export type ReceivablePaymentGetPayload<S extends boolean | null | undefined | ReceivablePaymentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload, S>;
export type ReceivablePaymentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReceivablePaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReceivablePaymentCountAggregateInputType | true;
};
export interface ReceivablePaymentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReceivablePayment'];
        meta: {
            name: 'ReceivablePayment';
        };
    };
    findUnique<T extends ReceivablePaymentFindUniqueArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReceivablePaymentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReceivablePaymentFindFirstArgs>(args?: Prisma.SelectSubset<T, ReceivablePaymentFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReceivablePaymentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReceivablePaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReceivablePaymentFindManyArgs>(args?: Prisma.SelectSubset<T, ReceivablePaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReceivablePaymentCreateArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentCreateArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReceivablePaymentCreateManyArgs>(args?: Prisma.SelectSubset<T, ReceivablePaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReceivablePaymentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReceivablePaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReceivablePaymentDeleteArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentDeleteArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReceivablePaymentUpdateArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentUpdateArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReceivablePaymentDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReceivablePaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReceivablePaymentUpdateManyArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReceivablePaymentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReceivablePaymentUpsertArgs>(args: Prisma.SelectSubset<T, ReceivablePaymentUpsertArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReceivablePaymentCountArgs>(args?: Prisma.Subset<T, ReceivablePaymentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReceivablePaymentCountAggregateOutputType> : number>;
    aggregate<T extends ReceivablePaymentAggregateArgs>(args: Prisma.Subset<T, ReceivablePaymentAggregateArgs>): Prisma.PrismaPromise<GetReceivablePaymentAggregateType<T>>;
    groupBy<T extends ReceivablePaymentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReceivablePaymentGroupByArgs['orderBy'];
    } : {
        orderBy?: ReceivablePaymentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReceivablePaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceivablePaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReceivablePaymentFieldRefs;
}
export interface Prisma__ReceivablePaymentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    entry<T extends Prisma.ReceivableEntryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivableEntryDefaultArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    account<T extends Prisma.ReceivablePayment$accountArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivablePayment$accountArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    journalEntry<T extends Prisma.ReceivablePayment$journalEntryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivablePayment$journalEntryArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    recordedBy<T extends Prisma.ReceivablePayment$recordedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivablePayment$recordedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReceivablePaymentFieldRefs {
    readonly id: Prisma.FieldRef<"ReceivablePayment", 'String'>;
    readonly entryId: Prisma.FieldRef<"ReceivablePayment", 'String'>;
    readonly amount: Prisma.FieldRef<"ReceivablePayment", 'Decimal'>;
    readonly method: Prisma.FieldRef<"ReceivablePayment", 'PaymentMethod'>;
    readonly accountId: Prisma.FieldRef<"ReceivablePayment", 'String'>;
    readonly notes: Prisma.FieldRef<"ReceivablePayment", 'String'>;
    readonly journalEntryId: Prisma.FieldRef<"ReceivablePayment", 'String'>;
    readonly recordedById: Prisma.FieldRef<"ReceivablePayment", 'String'>;
    readonly collectedAt: Prisma.FieldRef<"ReceivablePayment", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ReceivablePayment", 'DateTime'>;
}
export type ReceivablePaymentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where: Prisma.ReceivablePaymentWhereUniqueInput;
};
export type ReceivablePaymentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where: Prisma.ReceivablePaymentWhereUniqueInput;
};
export type ReceivablePaymentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePaymentWhereInput;
    orderBy?: Prisma.ReceivablePaymentOrderByWithRelationInput | Prisma.ReceivablePaymentOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePaymentScalarFieldEnum | Prisma.ReceivablePaymentScalarFieldEnum[];
};
export type ReceivablePaymentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePaymentWhereInput;
    orderBy?: Prisma.ReceivablePaymentOrderByWithRelationInput | Prisma.ReceivablePaymentOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePaymentScalarFieldEnum | Prisma.ReceivablePaymentScalarFieldEnum[];
};
export type ReceivablePaymentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePaymentWhereInput;
    orderBy?: Prisma.ReceivablePaymentOrderByWithRelationInput | Prisma.ReceivablePaymentOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePaymentScalarFieldEnum | Prisma.ReceivablePaymentScalarFieldEnum[];
};
export type ReceivablePaymentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablePaymentCreateInput, Prisma.ReceivablePaymentUncheckedCreateInput>;
};
export type ReceivablePaymentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReceivablePaymentCreateManyInput | Prisma.ReceivablePaymentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceivablePaymentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    data: Prisma.ReceivablePaymentCreateManyInput | Prisma.ReceivablePaymentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReceivablePaymentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReceivablePaymentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateInput, Prisma.ReceivablePaymentUncheckedUpdateInput>;
    where: Prisma.ReceivablePaymentWhereUniqueInput;
};
export type ReceivablePaymentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateManyMutationInput, Prisma.ReceivablePaymentUncheckedUpdateManyInput>;
    where?: Prisma.ReceivablePaymentWhereInput;
    limit?: number;
};
export type ReceivablePaymentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablePaymentUpdateManyMutationInput, Prisma.ReceivablePaymentUncheckedUpdateManyInput>;
    where?: Prisma.ReceivablePaymentWhereInput;
    limit?: number;
    include?: Prisma.ReceivablePaymentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReceivablePaymentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where: Prisma.ReceivablePaymentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePaymentCreateInput, Prisma.ReceivablePaymentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReceivablePaymentUpdateInput, Prisma.ReceivablePaymentUncheckedUpdateInput>;
};
export type ReceivablePaymentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where: Prisma.ReceivablePaymentWhereUniqueInput;
};
export type ReceivablePaymentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePaymentWhereInput;
    limit?: number;
};
export type ReceivablePayment$accountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where?: Prisma.AccountWhereInput;
};
export type ReceivablePayment$journalEntryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
};
export type ReceivablePayment$recordedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type ReceivablePaymentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
};
