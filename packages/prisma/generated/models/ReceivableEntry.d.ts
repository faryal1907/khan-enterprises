import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type ReceivableEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$ReceivableEntryPayload>;
export type AggregateReceivableEntry = {
    _count: ReceivableEntryCountAggregateOutputType | null;
    _avg: ReceivableEntryAvgAggregateOutputType | null;
    _sum: ReceivableEntrySumAggregateOutputType | null;
    _min: ReceivableEntryMinAggregateOutputType | null;
    _max: ReceivableEntryMaxAggregateOutputType | null;
};
export type ReceivableEntryAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
    paidAmount: runtime.Decimal | null;
    balanceDue: runtime.Decimal | null;
};
export type ReceivableEntrySumAggregateOutputType = {
    amount: runtime.Decimal | null;
    paidAmount: runtime.Decimal | null;
    balanceDue: runtime.Decimal | null;
};
export type ReceivableEntryMinAggregateOutputType = {
    id: string | null;
    partyId: string | null;
    vendorId: string | null;
    amount: runtime.Decimal | null;
    description: string | null;
    date: Date | null;
    dueDate: Date | null;
    paidAmount: runtime.Decimal | null;
    balanceDue: runtime.Decimal | null;
    status: $Enums.PaymentState | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReceivableEntryMaxAggregateOutputType = {
    id: string | null;
    partyId: string | null;
    vendorId: string | null;
    amount: runtime.Decimal | null;
    description: string | null;
    date: Date | null;
    dueDate: Date | null;
    paidAmount: runtime.Decimal | null;
    balanceDue: runtime.Decimal | null;
    status: $Enums.PaymentState | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReceivableEntryCountAggregateOutputType = {
    id: number;
    partyId: number;
    vendorId: number;
    amount: number;
    description: number;
    date: number;
    dueDate: number;
    paidAmount: number;
    balanceDue: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ReceivableEntryAvgAggregateInputType = {
    amount?: true;
    paidAmount?: true;
    balanceDue?: true;
};
export type ReceivableEntrySumAggregateInputType = {
    amount?: true;
    paidAmount?: true;
    balanceDue?: true;
};
export type ReceivableEntryMinAggregateInputType = {
    id?: true;
    partyId?: true;
    vendorId?: true;
    amount?: true;
    description?: true;
    date?: true;
    dueDate?: true;
    paidAmount?: true;
    balanceDue?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReceivableEntryMaxAggregateInputType = {
    id?: true;
    partyId?: true;
    vendorId?: true;
    amount?: true;
    description?: true;
    date?: true;
    dueDate?: true;
    paidAmount?: true;
    balanceDue?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReceivableEntryCountAggregateInputType = {
    id?: true;
    partyId?: true;
    vendorId?: true;
    amount?: true;
    description?: true;
    date?: true;
    dueDate?: true;
    paidAmount?: true;
    balanceDue?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ReceivableEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivableEntryWhereInput;
    orderBy?: Prisma.ReceivableEntryOrderByWithRelationInput | Prisma.ReceivableEntryOrderByWithRelationInput[];
    cursor?: Prisma.ReceivableEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReceivableEntryCountAggregateInputType;
    _avg?: ReceivableEntryAvgAggregateInputType;
    _sum?: ReceivableEntrySumAggregateInputType;
    _min?: ReceivableEntryMinAggregateInputType;
    _max?: ReceivableEntryMaxAggregateInputType;
};
export type GetReceivableEntryAggregateType<T extends ReceivableEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateReceivableEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReceivableEntry[P]> : Prisma.GetScalarType<T[P], AggregateReceivableEntry[P]>;
};
export type ReceivableEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivableEntryWhereInput;
    orderBy?: Prisma.ReceivableEntryOrderByWithAggregationInput | Prisma.ReceivableEntryOrderByWithAggregationInput[];
    by: Prisma.ReceivableEntryScalarFieldEnum[] | Prisma.ReceivableEntryScalarFieldEnum;
    having?: Prisma.ReceivableEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReceivableEntryCountAggregateInputType | true;
    _avg?: ReceivableEntryAvgAggregateInputType;
    _sum?: ReceivableEntrySumAggregateInputType;
    _min?: ReceivableEntryMinAggregateInputType;
    _max?: ReceivableEntryMaxAggregateInputType;
};
export type ReceivableEntryGroupByOutputType = {
    id: string;
    partyId: string;
    vendorId: string | null;
    amount: runtime.Decimal;
    description: string;
    date: Date;
    dueDate: Date | null;
    paidAmount: runtime.Decimal;
    balanceDue: runtime.Decimal;
    status: $Enums.PaymentState;
    createdAt: Date;
    updatedAt: Date;
    _count: ReceivableEntryCountAggregateOutputType | null;
    _avg: ReceivableEntryAvgAggregateOutputType | null;
    _sum: ReceivableEntrySumAggregateOutputType | null;
    _min: ReceivableEntryMinAggregateOutputType | null;
    _max: ReceivableEntryMaxAggregateOutputType | null;
};
export type GetReceivableEntryGroupByPayload<T extends ReceivableEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReceivableEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReceivableEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReceivableEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReceivableEntryGroupByOutputType[P]>;
}>>;
export type ReceivableEntryWhereInput = {
    AND?: Prisma.ReceivableEntryWhereInput | Prisma.ReceivableEntryWhereInput[];
    OR?: Prisma.ReceivableEntryWhereInput[];
    NOT?: Prisma.ReceivableEntryWhereInput | Prisma.ReceivableEntryWhereInput[];
    id?: Prisma.StringFilter<"ReceivableEntry"> | string;
    partyId?: Prisma.StringFilter<"ReceivableEntry"> | string;
    vendorId?: Prisma.StringNullableFilter<"ReceivableEntry"> | string | null;
    amount?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFilter<"ReceivableEntry"> | string;
    date?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    dueDate?: Prisma.DateTimeNullableFilter<"ReceivableEntry"> | Date | string | null;
    paidAmount?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFilter<"ReceivableEntry"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    party?: Prisma.XOR<Prisma.ReceivablePartyScalarRelationFilter, Prisma.ReceivablePartyWhereInput>;
    vendor?: Prisma.XOR<Prisma.VendorNullableScalarRelationFilter, Prisma.VendorWhereInput> | null;
    payments?: Prisma.ReceivablePaymentListRelationFilter;
};
export type ReceivableEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    partyId?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    party?: Prisma.ReceivablePartyOrderByWithRelationInput;
    vendor?: Prisma.VendorOrderByWithRelationInput;
    payments?: Prisma.ReceivablePaymentOrderByRelationAggregateInput;
};
export type ReceivableEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReceivableEntryWhereInput | Prisma.ReceivableEntryWhereInput[];
    OR?: Prisma.ReceivableEntryWhereInput[];
    NOT?: Prisma.ReceivableEntryWhereInput | Prisma.ReceivableEntryWhereInput[];
    partyId?: Prisma.StringFilter<"ReceivableEntry"> | string;
    vendorId?: Prisma.StringNullableFilter<"ReceivableEntry"> | string | null;
    amount?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFilter<"ReceivableEntry"> | string;
    date?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    dueDate?: Prisma.DateTimeNullableFilter<"ReceivableEntry"> | Date | string | null;
    paidAmount?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFilter<"ReceivableEntry"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    party?: Prisma.XOR<Prisma.ReceivablePartyScalarRelationFilter, Prisma.ReceivablePartyWhereInput>;
    vendor?: Prisma.XOR<Prisma.VendorNullableScalarRelationFilter, Prisma.VendorWhereInput> | null;
    payments?: Prisma.ReceivablePaymentListRelationFilter;
}, "id">;
export type ReceivableEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    partyId?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ReceivableEntryCountOrderByAggregateInput;
    _avg?: Prisma.ReceivableEntryAvgOrderByAggregateInput;
    _max?: Prisma.ReceivableEntryMaxOrderByAggregateInput;
    _min?: Prisma.ReceivableEntryMinOrderByAggregateInput;
    _sum?: Prisma.ReceivableEntrySumOrderByAggregateInput;
};
export type ReceivableEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReceivableEntryScalarWhereWithAggregatesInput | Prisma.ReceivableEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReceivableEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReceivableEntryScalarWhereWithAggregatesInput | Prisma.ReceivableEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ReceivableEntry"> | string;
    partyId?: Prisma.StringWithAggregatesFilter<"ReceivableEntry"> | string;
    vendorId?: Prisma.StringNullableWithAggregatesFilter<"ReceivableEntry"> | string | null;
    amount?: Prisma.DecimalWithAggregatesFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringWithAggregatesFilter<"ReceivableEntry"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"ReceivableEntry"> | Date | string;
    dueDate?: Prisma.DateTimeNullableWithAggregatesFilter<"ReceivableEntry"> | Date | string | null;
    paidAmount?: Prisma.DecimalWithAggregatesFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalWithAggregatesFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateWithAggregatesFilter<"ReceivableEntry"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivableEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivableEntry"> | Date | string;
};
export type ReceivableEntryCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    party: Prisma.ReceivablePartyCreateNestedOneWithoutEntriesInput;
    vendor?: Prisma.VendorCreateNestedOneWithoutReceivableEntriesInput;
    payments?: Prisma.ReceivablePaymentCreateNestedManyWithoutEntryInput;
};
export type ReceivableEntryUncheckedCreateInput = {
    id?: string;
    partyId: string;
    vendorId?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutEntryInput;
};
export type ReceivableEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    party?: Prisma.ReceivablePartyUpdateOneRequiredWithoutEntriesNestedInput;
    vendor?: Prisma.VendorUpdateOneWithoutReceivableEntriesNestedInput;
    payments?: Prisma.ReceivablePaymentUpdateManyWithoutEntryNestedInput;
};
export type ReceivableEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partyId?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutEntryNestedInput;
};
export type ReceivableEntryCreateManyInput = {
    id?: string;
    partyId: string;
    vendorId?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivableEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivableEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partyId?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivableEntryListRelationFilter = {
    every?: Prisma.ReceivableEntryWhereInput;
    some?: Prisma.ReceivableEntryWhereInput;
    none?: Prisma.ReceivableEntryWhereInput;
};
export type ReceivableEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReceivableEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partyId?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivableEntryAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
};
export type ReceivableEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partyId?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivableEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partyId?: Prisma.SortOrder;
    vendorId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivableEntrySumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    paidAmount?: Prisma.SortOrder;
    balanceDue?: Prisma.SortOrder;
};
export type ReceivableEntryScalarRelationFilter = {
    is?: Prisma.ReceivableEntryWhereInput;
    isNot?: Prisma.ReceivableEntryWhereInput;
};
export type ReceivableEntryCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutVendorInput, Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput> | Prisma.ReceivableEntryCreateWithoutVendorInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput | Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.ReceivableEntryCreateManyVendorInputEnvelope;
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
};
export type ReceivableEntryUncheckedCreateNestedManyWithoutVendorInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutVendorInput, Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput> | Prisma.ReceivableEntryCreateWithoutVendorInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput | Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput[];
    createMany?: Prisma.ReceivableEntryCreateManyVendorInputEnvelope;
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
};
export type ReceivableEntryUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutVendorInput, Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput> | Prisma.ReceivableEntryCreateWithoutVendorInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput | Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutVendorInput | Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.ReceivableEntryCreateManyVendorInputEnvelope;
    set?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    disconnect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    delete?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    update?: Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutVendorInput | Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.ReceivableEntryUpdateManyWithWhereWithoutVendorInput | Prisma.ReceivableEntryUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.ReceivableEntryScalarWhereInput | Prisma.ReceivableEntryScalarWhereInput[];
};
export type ReceivableEntryUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutVendorInput, Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput> | Prisma.ReceivableEntryCreateWithoutVendorInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput | Prisma.ReceivableEntryCreateOrConnectWithoutVendorInput[];
    upsert?: Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutVendorInput | Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: Prisma.ReceivableEntryCreateManyVendorInputEnvelope;
    set?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    disconnect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    delete?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    update?: Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutVendorInput | Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?: Prisma.ReceivableEntryUpdateManyWithWhereWithoutVendorInput | Prisma.ReceivableEntryUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: Prisma.ReceivableEntryScalarWhereInput | Prisma.ReceivableEntryScalarWhereInput[];
};
export type ReceivableEntryCreateNestedManyWithoutPartyInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPartyInput, Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput> | Prisma.ReceivableEntryCreateWithoutPartyInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput | Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput[];
    createMany?: Prisma.ReceivableEntryCreateManyPartyInputEnvelope;
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
};
export type ReceivableEntryUncheckedCreateNestedManyWithoutPartyInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPartyInput, Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput> | Prisma.ReceivableEntryCreateWithoutPartyInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput | Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput[];
    createMany?: Prisma.ReceivableEntryCreateManyPartyInputEnvelope;
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
};
export type ReceivableEntryUpdateManyWithoutPartyNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPartyInput, Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput> | Prisma.ReceivableEntryCreateWithoutPartyInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput | Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput[];
    upsert?: Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutPartyInput | Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutPartyInput[];
    createMany?: Prisma.ReceivableEntryCreateManyPartyInputEnvelope;
    set?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    disconnect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    delete?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    update?: Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutPartyInput | Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutPartyInput[];
    updateMany?: Prisma.ReceivableEntryUpdateManyWithWhereWithoutPartyInput | Prisma.ReceivableEntryUpdateManyWithWhereWithoutPartyInput[];
    deleteMany?: Prisma.ReceivableEntryScalarWhereInput | Prisma.ReceivableEntryScalarWhereInput[];
};
export type ReceivableEntryUncheckedUpdateManyWithoutPartyNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPartyInput, Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput> | Prisma.ReceivableEntryCreateWithoutPartyInput[] | Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput[];
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput | Prisma.ReceivableEntryCreateOrConnectWithoutPartyInput[];
    upsert?: Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutPartyInput | Prisma.ReceivableEntryUpsertWithWhereUniqueWithoutPartyInput[];
    createMany?: Prisma.ReceivableEntryCreateManyPartyInputEnvelope;
    set?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    disconnect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    delete?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    connect?: Prisma.ReceivableEntryWhereUniqueInput | Prisma.ReceivableEntryWhereUniqueInput[];
    update?: Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutPartyInput | Prisma.ReceivableEntryUpdateWithWhereUniqueWithoutPartyInput[];
    updateMany?: Prisma.ReceivableEntryUpdateManyWithWhereWithoutPartyInput | Prisma.ReceivableEntryUpdateManyWithWhereWithoutPartyInput[];
    deleteMany?: Prisma.ReceivableEntryScalarWhereInput | Prisma.ReceivableEntryScalarWhereInput[];
};
export type ReceivableEntryCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPaymentsInput, Prisma.ReceivableEntryUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.ReceivableEntryWhereUniqueInput;
};
export type ReceivableEntryUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPaymentsInput, Prisma.ReceivableEntryUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.ReceivableEntryCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.ReceivableEntryUpsertWithoutPaymentsInput;
    connect?: Prisma.ReceivableEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReceivableEntryUpdateToOneWithWhereWithoutPaymentsInput, Prisma.ReceivableEntryUpdateWithoutPaymentsInput>, Prisma.ReceivableEntryUncheckedUpdateWithoutPaymentsInput>;
};
export type ReceivableEntryCreateWithoutVendorInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    party: Prisma.ReceivablePartyCreateNestedOneWithoutEntriesInput;
    payments?: Prisma.ReceivablePaymentCreateNestedManyWithoutEntryInput;
};
export type ReceivableEntryUncheckedCreateWithoutVendorInput = {
    id?: string;
    partyId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutEntryInput;
};
export type ReceivableEntryCreateOrConnectWithoutVendorInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutVendorInput, Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput>;
};
export type ReceivableEntryCreateManyVendorInputEnvelope = {
    data: Prisma.ReceivableEntryCreateManyVendorInput | Prisma.ReceivableEntryCreateManyVendorInput[];
    skipDuplicates?: boolean;
};
export type ReceivableEntryUpsertWithWhereUniqueWithoutVendorInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReceivableEntryUpdateWithoutVendorInput, Prisma.ReceivableEntryUncheckedUpdateWithoutVendorInput>;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutVendorInput, Prisma.ReceivableEntryUncheckedCreateWithoutVendorInput>;
};
export type ReceivableEntryUpdateWithWhereUniqueWithoutVendorInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateWithoutVendorInput, Prisma.ReceivableEntryUncheckedUpdateWithoutVendorInput>;
};
export type ReceivableEntryUpdateManyWithWhereWithoutVendorInput = {
    where: Prisma.ReceivableEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateManyMutationInput, Prisma.ReceivableEntryUncheckedUpdateManyWithoutVendorInput>;
};
export type ReceivableEntryScalarWhereInput = {
    AND?: Prisma.ReceivableEntryScalarWhereInput | Prisma.ReceivableEntryScalarWhereInput[];
    OR?: Prisma.ReceivableEntryScalarWhereInput[];
    NOT?: Prisma.ReceivableEntryScalarWhereInput | Prisma.ReceivableEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"ReceivableEntry"> | string;
    partyId?: Prisma.StringFilter<"ReceivableEntry"> | string;
    vendorId?: Prisma.StringNullableFilter<"ReceivableEntry"> | string | null;
    amount?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFilter<"ReceivableEntry"> | string;
    date?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    dueDate?: Prisma.DateTimeNullableFilter<"ReceivableEntry"> | Date | string | null;
    paidAmount?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFilter<"ReceivableEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFilter<"ReceivableEntry"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivableEntry"> | Date | string;
};
export type ReceivableEntryCreateWithoutPartyInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor?: Prisma.VendorCreateNestedOneWithoutReceivableEntriesInput;
    payments?: Prisma.ReceivablePaymentCreateNestedManyWithoutEntryInput;
};
export type ReceivableEntryUncheckedCreateWithoutPartyInput = {
    id?: string;
    vendorId?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutEntryInput;
};
export type ReceivableEntryCreateOrConnectWithoutPartyInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPartyInput, Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput>;
};
export type ReceivableEntryCreateManyPartyInputEnvelope = {
    data: Prisma.ReceivableEntryCreateManyPartyInput | Prisma.ReceivableEntryCreateManyPartyInput[];
    skipDuplicates?: boolean;
};
export type ReceivableEntryUpsertWithWhereUniqueWithoutPartyInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReceivableEntryUpdateWithoutPartyInput, Prisma.ReceivableEntryUncheckedUpdateWithoutPartyInput>;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPartyInput, Prisma.ReceivableEntryUncheckedCreateWithoutPartyInput>;
};
export type ReceivableEntryUpdateWithWhereUniqueWithoutPartyInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateWithoutPartyInput, Prisma.ReceivableEntryUncheckedUpdateWithoutPartyInput>;
};
export type ReceivableEntryUpdateManyWithWhereWithoutPartyInput = {
    where: Prisma.ReceivableEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateManyMutationInput, Prisma.ReceivableEntryUncheckedUpdateManyWithoutPartyInput>;
};
export type ReceivableEntryCreateWithoutPaymentsInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    party: Prisma.ReceivablePartyCreateNestedOneWithoutEntriesInput;
    vendor?: Prisma.VendorCreateNestedOneWithoutReceivableEntriesInput;
};
export type ReceivableEntryUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    partyId: string;
    vendorId?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivableEntryCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.ReceivableEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPaymentsInput, Prisma.ReceivableEntryUncheckedCreateWithoutPaymentsInput>;
};
export type ReceivableEntryUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.ReceivableEntryUpdateWithoutPaymentsInput, Prisma.ReceivableEntryUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateWithoutPaymentsInput, Prisma.ReceivableEntryUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.ReceivableEntryWhereInput;
};
export type ReceivableEntryUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.ReceivableEntryWhereInput;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateWithoutPaymentsInput, Prisma.ReceivableEntryUncheckedUpdateWithoutPaymentsInput>;
};
export type ReceivableEntryUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    party?: Prisma.ReceivablePartyUpdateOneRequiredWithoutEntriesNestedInput;
    vendor?: Prisma.VendorUpdateOneWithoutReceivableEntriesNestedInput;
};
export type ReceivableEntryUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partyId?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivableEntryCreateManyVendorInput = {
    id?: string;
    partyId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivableEntryUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    party?: Prisma.ReceivablePartyUpdateOneRequiredWithoutEntriesNestedInput;
    payments?: Prisma.ReceivablePaymentUpdateManyWithoutEntryNestedInput;
};
export type ReceivableEntryUncheckedUpdateWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partyId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutEntryNestedInput;
};
export type ReceivableEntryUncheckedUpdateManyWithoutVendorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partyId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivableEntryCreateManyPartyInput = {
    id?: string;
    vendorId?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    description: string;
    date?: Date | string;
    dueDate?: Date | string | null;
    paidAmount?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivableEntryUpdateWithoutPartyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: Prisma.VendorUpdateOneWithoutReceivableEntriesNestedInput;
    payments?: Prisma.ReceivablePaymentUpdateManyWithoutEntryNestedInput;
};
export type ReceivableEntryUncheckedUpdateWithoutPartyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutEntryNestedInput;
};
export type ReceivableEntryUncheckedUpdateManyWithoutPartyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vendorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    balanceDue?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivableEntryCountOutputType = {
    payments: number;
};
export type ReceivableEntryCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    payments?: boolean | ReceivableEntryCountOutputTypeCountPaymentsArgs;
};
export type ReceivableEntryCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntryCountOutputTypeSelect<ExtArgs> | null;
};
export type ReceivableEntryCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePaymentWhereInput;
};
export type ReceivableEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partyId?: boolean;
    vendorId?: boolean;
    amount?: boolean;
    description?: boolean;
    date?: boolean;
    dueDate?: boolean;
    paidAmount?: boolean;
    balanceDue?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    party?: boolean | Prisma.ReceivablePartyDefaultArgs<ExtArgs>;
    vendor?: boolean | Prisma.ReceivableEntry$vendorArgs<ExtArgs>;
    payments?: boolean | Prisma.ReceivableEntry$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ReceivableEntryCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["receivableEntry"]>;
export type ReceivableEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partyId?: boolean;
    vendorId?: boolean;
    amount?: boolean;
    description?: boolean;
    date?: boolean;
    dueDate?: boolean;
    paidAmount?: boolean;
    balanceDue?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    party?: boolean | Prisma.ReceivablePartyDefaultArgs<ExtArgs>;
    vendor?: boolean | Prisma.ReceivableEntry$vendorArgs<ExtArgs>;
}, ExtArgs["result"]["receivableEntry"]>;
export type ReceivableEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partyId?: boolean;
    vendorId?: boolean;
    amount?: boolean;
    description?: boolean;
    date?: boolean;
    dueDate?: boolean;
    paidAmount?: boolean;
    balanceDue?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    party?: boolean | Prisma.ReceivablePartyDefaultArgs<ExtArgs>;
    vendor?: boolean | Prisma.ReceivableEntry$vendorArgs<ExtArgs>;
}, ExtArgs["result"]["receivableEntry"]>;
export type ReceivableEntrySelectScalar = {
    id?: boolean;
    partyId?: boolean;
    vendorId?: boolean;
    amount?: boolean;
    description?: boolean;
    date?: boolean;
    dueDate?: boolean;
    paidAmount?: boolean;
    balanceDue?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ReceivableEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "partyId" | "vendorId" | "amount" | "description" | "date" | "dueDate" | "paidAmount" | "balanceDue" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["receivableEntry"]>;
export type ReceivableEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    party?: boolean | Prisma.ReceivablePartyDefaultArgs<ExtArgs>;
    vendor?: boolean | Prisma.ReceivableEntry$vendorArgs<ExtArgs>;
    payments?: boolean | Prisma.ReceivableEntry$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ReceivableEntryCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ReceivableEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    party?: boolean | Prisma.ReceivablePartyDefaultArgs<ExtArgs>;
    vendor?: boolean | Prisma.ReceivableEntry$vendorArgs<ExtArgs>;
};
export type ReceivableEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    party?: boolean | Prisma.ReceivablePartyDefaultArgs<ExtArgs>;
    vendor?: boolean | Prisma.ReceivableEntry$vendorArgs<ExtArgs>;
};
export type $ReceivableEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReceivableEntry";
    objects: {
        party: Prisma.$ReceivablePartyPayload<ExtArgs>;
        vendor: Prisma.$VendorPayload<ExtArgs> | null;
        payments: Prisma.$ReceivablePaymentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        partyId: string;
        vendorId: string | null;
        amount: runtime.Decimal;
        description: string;
        date: Date;
        dueDate: Date | null;
        paidAmount: runtime.Decimal;
        balanceDue: runtime.Decimal;
        status: $Enums.PaymentState;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["receivableEntry"]>;
    composites: {};
};
export type ReceivableEntryGetPayload<S extends boolean | null | undefined | ReceivableEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload, S>;
export type ReceivableEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReceivableEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReceivableEntryCountAggregateInputType | true;
};
export interface ReceivableEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReceivableEntry'];
        meta: {
            name: 'ReceivableEntry';
        };
    };
    findUnique<T extends ReceivableEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, ReceivableEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReceivableEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReceivableEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReceivableEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, ReceivableEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReceivableEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReceivableEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReceivableEntryFindManyArgs>(args?: Prisma.SelectSubset<T, ReceivableEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReceivableEntryCreateArgs>(args: Prisma.SelectSubset<T, ReceivableEntryCreateArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReceivableEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, ReceivableEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReceivableEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReceivableEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReceivableEntryDeleteArgs>(args: Prisma.SelectSubset<T, ReceivableEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReceivableEntryUpdateArgs>(args: Prisma.SelectSubset<T, ReceivableEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReceivableEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReceivableEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReceivableEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, ReceivableEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReceivableEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReceivableEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReceivableEntryUpsertArgs>(args: Prisma.SelectSubset<T, ReceivableEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__ReceivableEntryClient<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReceivableEntryCountArgs>(args?: Prisma.Subset<T, ReceivableEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReceivableEntryCountAggregateOutputType> : number>;
    aggregate<T extends ReceivableEntryAggregateArgs>(args: Prisma.Subset<T, ReceivableEntryAggregateArgs>): Prisma.PrismaPromise<GetReceivableEntryAggregateType<T>>;
    groupBy<T extends ReceivableEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReceivableEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: ReceivableEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReceivableEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceivableEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReceivableEntryFieldRefs;
}
export interface Prisma__ReceivableEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    party<T extends Prisma.ReceivablePartyDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivablePartyDefaultArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    vendor<T extends Prisma.ReceivableEntry$vendorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivableEntry$vendorArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    payments<T extends Prisma.ReceivableEntry$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivableEntry$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReceivableEntryFieldRefs {
    readonly id: Prisma.FieldRef<"ReceivableEntry", 'String'>;
    readonly partyId: Prisma.FieldRef<"ReceivableEntry", 'String'>;
    readonly vendorId: Prisma.FieldRef<"ReceivableEntry", 'String'>;
    readonly amount: Prisma.FieldRef<"ReceivableEntry", 'Decimal'>;
    readonly description: Prisma.FieldRef<"ReceivableEntry", 'String'>;
    readonly date: Prisma.FieldRef<"ReceivableEntry", 'DateTime'>;
    readonly dueDate: Prisma.FieldRef<"ReceivableEntry", 'DateTime'>;
    readonly paidAmount: Prisma.FieldRef<"ReceivableEntry", 'Decimal'>;
    readonly balanceDue: Prisma.FieldRef<"ReceivableEntry", 'Decimal'>;
    readonly status: Prisma.FieldRef<"ReceivableEntry", 'PaymentState'>;
    readonly createdAt: Prisma.FieldRef<"ReceivableEntry", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ReceivableEntry", 'DateTime'>;
}
export type ReceivableEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where: Prisma.ReceivableEntryWhereUniqueInput;
};
export type ReceivableEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where: Prisma.ReceivableEntryWhereUniqueInput;
};
export type ReceivableEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where?: Prisma.ReceivableEntryWhereInput;
    orderBy?: Prisma.ReceivableEntryOrderByWithRelationInput | Prisma.ReceivableEntryOrderByWithRelationInput[];
    cursor?: Prisma.ReceivableEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivableEntryScalarFieldEnum | Prisma.ReceivableEntryScalarFieldEnum[];
};
export type ReceivableEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where?: Prisma.ReceivableEntryWhereInput;
    orderBy?: Prisma.ReceivableEntryOrderByWithRelationInput | Prisma.ReceivableEntryOrderByWithRelationInput[];
    cursor?: Prisma.ReceivableEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivableEntryScalarFieldEnum | Prisma.ReceivableEntryScalarFieldEnum[];
};
export type ReceivableEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where?: Prisma.ReceivableEntryWhereInput;
    orderBy?: Prisma.ReceivableEntryOrderByWithRelationInput | Prisma.ReceivableEntryOrderByWithRelationInput[];
    cursor?: Prisma.ReceivableEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivableEntryScalarFieldEnum | Prisma.ReceivableEntryScalarFieldEnum[];
};
export type ReceivableEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivableEntryCreateInput, Prisma.ReceivableEntryUncheckedCreateInput>;
};
export type ReceivableEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReceivableEntryCreateManyInput | Prisma.ReceivableEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceivableEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    data: Prisma.ReceivableEntryCreateManyInput | Prisma.ReceivableEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReceivableEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReceivableEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateInput, Prisma.ReceivableEntryUncheckedUpdateInput>;
    where: Prisma.ReceivableEntryWhereUniqueInput;
};
export type ReceivableEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateManyMutationInput, Prisma.ReceivableEntryUncheckedUpdateManyInput>;
    where?: Prisma.ReceivableEntryWhereInput;
    limit?: number;
};
export type ReceivableEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivableEntryUpdateManyMutationInput, Prisma.ReceivableEntryUncheckedUpdateManyInput>;
    where?: Prisma.ReceivableEntryWhereInput;
    limit?: number;
    include?: Prisma.ReceivableEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReceivableEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where: Prisma.ReceivableEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivableEntryCreateInput, Prisma.ReceivableEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReceivableEntryUpdateInput, Prisma.ReceivableEntryUncheckedUpdateInput>;
};
export type ReceivableEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
    where: Prisma.ReceivableEntryWhereUniqueInput;
};
export type ReceivableEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivableEntryWhereInput;
    limit?: number;
};
export type ReceivableEntry$vendorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
};
export type ReceivableEntry$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReceivableEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivableEntrySelect<ExtArgs> | null;
    omit?: Prisma.ReceivableEntryOmit<ExtArgs> | null;
    include?: Prisma.ReceivableEntryInclude<ExtArgs> | null;
};
