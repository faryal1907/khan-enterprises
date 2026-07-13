import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type JournalEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$JournalEntryPayload>;
export type AggregateJournalEntry = {
    _count: JournalEntryCountAggregateOutputType | null;
    _min: JournalEntryMinAggregateOutputType | null;
    _max: JournalEntryMaxAggregateOutputType | null;
};
export type JournalEntryMinAggregateOutputType = {
    id: string | null;
    entryNo: string | null;
    date: Date | null;
    description: string | null;
    sourceRef: string | null;
    notes: string | null;
    status: $Enums.JournalStatus | null;
    isManual: boolean | null;
    createdAt: Date | null;
    isReversal: boolean | null;
    reversesJournalEntryId: string | null;
};
export type JournalEntryMaxAggregateOutputType = {
    id: string | null;
    entryNo: string | null;
    date: Date | null;
    description: string | null;
    sourceRef: string | null;
    notes: string | null;
    status: $Enums.JournalStatus | null;
    isManual: boolean | null;
    createdAt: Date | null;
    isReversal: boolean | null;
    reversesJournalEntryId: string | null;
};
export type JournalEntryCountAggregateOutputType = {
    id: number;
    entryNo: number;
    date: number;
    description: number;
    sourceRef: number;
    notes: number;
    status: number;
    isManual: number;
    createdAt: number;
    isReversal: number;
    reversesJournalEntryId: number;
    _all: number;
};
export type JournalEntryMinAggregateInputType = {
    id?: true;
    entryNo?: true;
    date?: true;
    description?: true;
    sourceRef?: true;
    notes?: true;
    status?: true;
    isManual?: true;
    createdAt?: true;
    isReversal?: true;
    reversesJournalEntryId?: true;
};
export type JournalEntryMaxAggregateInputType = {
    id?: true;
    entryNo?: true;
    date?: true;
    description?: true;
    sourceRef?: true;
    notes?: true;
    status?: true;
    isManual?: true;
    createdAt?: true;
    isReversal?: true;
    reversesJournalEntryId?: true;
};
export type JournalEntryCountAggregateInputType = {
    id?: true;
    entryNo?: true;
    date?: true;
    description?: true;
    sourceRef?: true;
    notes?: true;
    status?: true;
    isManual?: true;
    createdAt?: true;
    isReversal?: true;
    reversesJournalEntryId?: true;
    _all?: true;
};
export type JournalEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithRelationInput | Prisma.JournalEntryOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | JournalEntryCountAggregateInputType;
    _min?: JournalEntryMinAggregateInputType;
    _max?: JournalEntryMaxAggregateInputType;
};
export type GetJournalEntryAggregateType<T extends JournalEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateJournalEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateJournalEntry[P]> : Prisma.GetScalarType<T[P], AggregateJournalEntry[P]>;
};
export type JournalEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithAggregationInput | Prisma.JournalEntryOrderByWithAggregationInput[];
    by: Prisma.JournalEntryScalarFieldEnum[] | Prisma.JournalEntryScalarFieldEnum;
    having?: Prisma.JournalEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: JournalEntryCountAggregateInputType | true;
    _min?: JournalEntryMinAggregateInputType;
    _max?: JournalEntryMaxAggregateInputType;
};
export type JournalEntryGroupByOutputType = {
    id: string;
    entryNo: string;
    date: Date;
    description: string;
    sourceRef: string | null;
    notes: string | null;
    status: $Enums.JournalStatus;
    isManual: boolean;
    createdAt: Date;
    isReversal: boolean;
    reversesJournalEntryId: string | null;
    _count: JournalEntryCountAggregateOutputType | null;
    _min: JournalEntryMinAggregateOutputType | null;
    _max: JournalEntryMaxAggregateOutputType | null;
};
export type GetJournalEntryGroupByPayload<T extends JournalEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<JournalEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof JournalEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], JournalEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], JournalEntryGroupByOutputType[P]>;
}>>;
export type JournalEntryWhereInput = {
    AND?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    OR?: Prisma.JournalEntryWhereInput[];
    NOT?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    id?: Prisma.StringFilter<"JournalEntry"> | string;
    entryNo?: Prisma.StringFilter<"JournalEntry"> | string;
    date?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringFilter<"JournalEntry"> | string;
    sourceRef?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    notes?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalStatusFilter<"JournalEntry"> | $Enums.JournalStatus;
    isManual?: Prisma.BoolFilter<"JournalEntry"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    isReversal?: Prisma.BoolFilter<"JournalEntry"> | boolean;
    reversesJournalEntryId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    lines?: Prisma.JournalEntryLineListRelationFilter;
    vendorPayment?: Prisma.XOR<Prisma.VendorPaymentNullableScalarRelationFilter, Prisma.VendorPaymentWhereInput> | null;
    vendorAllocation?: Prisma.XOR<Prisma.VendorAllocationNullableScalarRelationFilter, Prisma.VendorAllocationWhereInput> | null;
    vendorDefectiveReturn?: Prisma.XOR<Prisma.VendorDefectiveReturnNullableScalarRelationFilter, Prisma.VendorDefectiveReturnWhereInput> | null;
    receivablePayment?: Prisma.XOR<Prisma.ReceivablePaymentNullableScalarRelationFilter, Prisma.ReceivablePaymentWhereInput> | null;
};
export type JournalEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    entryNo?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    isReversal?: Prisma.SortOrder;
    reversesJournalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    lines?: Prisma.JournalEntryLineOrderByRelationAggregateInput;
    vendorPayment?: Prisma.VendorPaymentOrderByWithRelationInput;
    vendorAllocation?: Prisma.VendorAllocationOrderByWithRelationInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnOrderByWithRelationInput;
    receivablePayment?: Prisma.ReceivablePaymentOrderByWithRelationInput;
};
export type JournalEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    entryNo?: string;
    AND?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    OR?: Prisma.JournalEntryWhereInput[];
    NOT?: Prisma.JournalEntryWhereInput | Prisma.JournalEntryWhereInput[];
    date?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringFilter<"JournalEntry"> | string;
    sourceRef?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    notes?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalStatusFilter<"JournalEntry"> | $Enums.JournalStatus;
    isManual?: Prisma.BoolFilter<"JournalEntry"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"JournalEntry"> | Date | string;
    isReversal?: Prisma.BoolFilter<"JournalEntry"> | boolean;
    reversesJournalEntryId?: Prisma.StringNullableFilter<"JournalEntry"> | string | null;
    lines?: Prisma.JournalEntryLineListRelationFilter;
    vendorPayment?: Prisma.XOR<Prisma.VendorPaymentNullableScalarRelationFilter, Prisma.VendorPaymentWhereInput> | null;
    vendorAllocation?: Prisma.XOR<Prisma.VendorAllocationNullableScalarRelationFilter, Prisma.VendorAllocationWhereInput> | null;
    vendorDefectiveReturn?: Prisma.XOR<Prisma.VendorDefectiveReturnNullableScalarRelationFilter, Prisma.VendorDefectiveReturnWhereInput> | null;
    receivablePayment?: Prisma.XOR<Prisma.ReceivablePaymentNullableScalarRelationFilter, Prisma.ReceivablePaymentWhereInput> | null;
}, "id" | "entryNo">;
export type JournalEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    entryNo?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    isReversal?: Prisma.SortOrder;
    reversesJournalEntryId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.JournalEntryCountOrderByAggregateInput;
    _max?: Prisma.JournalEntryMaxOrderByAggregateInput;
    _min?: Prisma.JournalEntryMinOrderByAggregateInput;
};
export type JournalEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.JournalEntryScalarWhereWithAggregatesInput | Prisma.JournalEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.JournalEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.JournalEntryScalarWhereWithAggregatesInput | Prisma.JournalEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"JournalEntry"> | string;
    entryNo?: Prisma.StringWithAggregatesFilter<"JournalEntry"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string;
    description?: Prisma.StringWithAggregatesFilter<"JournalEntry"> | string;
    sourceRef?: Prisma.StringNullableWithAggregatesFilter<"JournalEntry"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"JournalEntry"> | string | null;
    status?: Prisma.EnumJournalStatusWithAggregatesFilter<"JournalEntry"> | $Enums.JournalStatus;
    isManual?: Prisma.BoolWithAggregatesFilter<"JournalEntry"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"JournalEntry"> | Date | string;
    isReversal?: Prisma.BoolWithAggregatesFilter<"JournalEntry"> | boolean;
    reversesJournalEntryId?: Prisma.StringNullableWithAggregatesFilter<"JournalEntry"> | string | null;
};
export type JournalEntryCreateInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateManyInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
};
export type JournalEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type JournalEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type JournalEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entryNo?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    isReversal?: Prisma.SortOrder;
    reversesJournalEntryId?: Prisma.SortOrder;
};
export type JournalEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entryNo?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    isReversal?: Prisma.SortOrder;
    reversesJournalEntryId?: Prisma.SortOrder;
};
export type JournalEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entryNo?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sourceRef?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    isReversal?: Prisma.SortOrder;
    reversesJournalEntryId?: Prisma.SortOrder;
};
export type JournalEntryScalarRelationFilter = {
    is?: Prisma.JournalEntryWhereInput;
    isNot?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryNullableScalarRelationFilter = {
    is?: Prisma.JournalEntryWhereInput | null;
    isNot?: Prisma.JournalEntryWhereInput | null;
};
export type EnumJournalStatusFieldUpdateOperationsInput = {
    set?: $Enums.JournalStatus;
};
export type JournalEntryCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutLinesInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.JournalEntryUpsertWithoutLinesInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutLinesInput, Prisma.JournalEntryUpdateWithoutLinesInput>, Prisma.JournalEntryUncheckedUpdateWithoutLinesInput>;
};
export type JournalEntryCreateNestedOneWithoutVendorPaymentInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorPaymentInput, Prisma.JournalEntryUncheckedCreateWithoutVendorPaymentInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutVendorPaymentInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneWithoutVendorPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorPaymentInput, Prisma.JournalEntryUncheckedCreateWithoutVendorPaymentInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutVendorPaymentInput;
    upsert?: Prisma.JournalEntryUpsertWithoutVendorPaymentInput;
    disconnect?: Prisma.JournalEntryWhereInput | boolean;
    delete?: Prisma.JournalEntryWhereInput | boolean;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutVendorPaymentInput, Prisma.JournalEntryUpdateWithoutVendorPaymentInput>, Prisma.JournalEntryUncheckedUpdateWithoutVendorPaymentInput>;
};
export type JournalEntryCreateNestedOneWithoutVendorAllocationInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorAllocationInput, Prisma.JournalEntryUncheckedCreateWithoutVendorAllocationInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutVendorAllocationInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneWithoutVendorAllocationNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorAllocationInput, Prisma.JournalEntryUncheckedCreateWithoutVendorAllocationInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutVendorAllocationInput;
    upsert?: Prisma.JournalEntryUpsertWithoutVendorAllocationInput;
    disconnect?: Prisma.JournalEntryWhereInput | boolean;
    delete?: Prisma.JournalEntryWhereInput | boolean;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutVendorAllocationInput, Prisma.JournalEntryUpdateWithoutVendorAllocationInput>, Prisma.JournalEntryUncheckedUpdateWithoutVendorAllocationInput>;
};
export type JournalEntryCreateNestedOneWithoutVendorDefectiveReturnInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUncheckedCreateWithoutVendorDefectiveReturnInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutVendorDefectiveReturnInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneWithoutVendorDefectiveReturnNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUncheckedCreateWithoutVendorDefectiveReturnInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutVendorDefectiveReturnInput;
    upsert?: Prisma.JournalEntryUpsertWithoutVendorDefectiveReturnInput;
    disconnect?: Prisma.JournalEntryWhereInput | boolean;
    delete?: Prisma.JournalEntryWhereInput | boolean;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUpdateWithoutVendorDefectiveReturnInput>, Prisma.JournalEntryUncheckedUpdateWithoutVendorDefectiveReturnInput>;
};
export type JournalEntryCreateNestedOneWithoutReceivablePaymentInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutReceivablePaymentInput, Prisma.JournalEntryUncheckedCreateWithoutReceivablePaymentInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutReceivablePaymentInput;
    connect?: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateOneWithoutReceivablePaymentNestedInput = {
    create?: Prisma.XOR<Prisma.JournalEntryCreateWithoutReceivablePaymentInput, Prisma.JournalEntryUncheckedCreateWithoutReceivablePaymentInput>;
    connectOrCreate?: Prisma.JournalEntryCreateOrConnectWithoutReceivablePaymentInput;
    upsert?: Prisma.JournalEntryUpsertWithoutReceivablePaymentInput;
    disconnect?: Prisma.JournalEntryWhereInput | boolean;
    delete?: Prisma.JournalEntryWhereInput | boolean;
    connect?: Prisma.JournalEntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.JournalEntryUpdateToOneWithWhereWithoutReceivablePaymentInput, Prisma.JournalEntryUpdateWithoutReceivablePaymentInput>, Prisma.JournalEntryUncheckedUpdateWithoutReceivablePaymentInput>;
};
export type JournalEntryCreateWithoutLinesInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    vendorPayment?: Prisma.VendorPaymentCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutLinesInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    vendorPayment?: Prisma.VendorPaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutLinesInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
};
export type JournalEntryUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutLinesInput, Prisma.JournalEntryUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutLinesInput, Prisma.JournalEntryUncheckedCreateWithoutLinesInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutLinesInput, Prisma.JournalEntryUncheckedUpdateWithoutLinesInput>;
};
export type JournalEntryUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vendorPayment?: Prisma.VendorPaymentUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    vendorPayment?: Prisma.VendorPaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateWithoutVendorPaymentInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutVendorPaymentInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutVendorPaymentInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorPaymentInput, Prisma.JournalEntryUncheckedCreateWithoutVendorPaymentInput>;
};
export type JournalEntryUpsertWithoutVendorPaymentInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutVendorPaymentInput, Prisma.JournalEntryUncheckedUpdateWithoutVendorPaymentInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorPaymentInput, Prisma.JournalEntryUncheckedCreateWithoutVendorPaymentInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutVendorPaymentInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutVendorPaymentInput, Prisma.JournalEntryUncheckedUpdateWithoutVendorPaymentInput>;
};
export type JournalEntryUpdateWithoutVendorPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutVendorPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateWithoutVendorAllocationInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutVendorAllocationInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutVendorAllocationInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorAllocationInput, Prisma.JournalEntryUncheckedCreateWithoutVendorAllocationInput>;
};
export type JournalEntryUpsertWithoutVendorAllocationInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutVendorAllocationInput, Prisma.JournalEntryUncheckedUpdateWithoutVendorAllocationInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorAllocationInput, Prisma.JournalEntryUncheckedCreateWithoutVendorAllocationInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutVendorAllocationInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutVendorAllocationInput, Prisma.JournalEntryUncheckedUpdateWithoutVendorAllocationInput>;
};
export type JournalEntryUpdateWithoutVendorAllocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutVendorAllocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateWithoutVendorDefectiveReturnInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutVendorDefectiveReturnInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedCreateNestedOneWithoutJournalEntryInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutVendorDefectiveReturnInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUncheckedCreateWithoutVendorDefectiveReturnInput>;
};
export type JournalEntryUpsertWithoutVendorDefectiveReturnInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUncheckedUpdateWithoutVendorDefectiveReturnInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUncheckedCreateWithoutVendorDefectiveReturnInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutVendorDefectiveReturnInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutVendorDefectiveReturnInput, Prisma.JournalEntryUncheckedUpdateWithoutVendorDefectiveReturnInput>;
};
export type JournalEntryUpdateWithoutVendorDefectiveReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutVendorDefectiveReturnInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedUpdateOneWithoutJournalEntryNestedInput;
    receivablePayment?: Prisma.ReceivablePaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryCreateWithoutReceivablePaymentInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryUncheckedCreateWithoutReceivablePaymentInput = {
    id?: string;
    entryNo: string;
    date?: Date | string;
    description: string;
    sourceRef?: string | null;
    notes?: string | null;
    status?: $Enums.JournalStatus;
    isManual?: boolean;
    createdAt?: Date | string;
    isReversal?: boolean;
    reversesJournalEntryId?: string | null;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutJournalEntryInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedCreateNestedOneWithoutJournalEntryInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedCreateNestedOneWithoutJournalEntryInput;
};
export type JournalEntryCreateOrConnectWithoutReceivablePaymentInput = {
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutReceivablePaymentInput, Prisma.JournalEntryUncheckedCreateWithoutReceivablePaymentInput>;
};
export type JournalEntryUpsertWithoutReceivablePaymentInput = {
    update: Prisma.XOR<Prisma.JournalEntryUpdateWithoutReceivablePaymentInput, Prisma.JournalEntryUncheckedUpdateWithoutReceivablePaymentInput>;
    create: Prisma.XOR<Prisma.JournalEntryCreateWithoutReceivablePaymentInput, Prisma.JournalEntryUncheckedCreateWithoutReceivablePaymentInput>;
    where?: Prisma.JournalEntryWhereInput;
};
export type JournalEntryUpdateToOneWithWhereWithoutReceivablePaymentInput = {
    where?: Prisma.JournalEntryWhereInput;
    data: Prisma.XOR<Prisma.JournalEntryUpdateWithoutReceivablePaymentInput, Prisma.JournalEntryUncheckedUpdateWithoutReceivablePaymentInput>;
};
export type JournalEntryUpdateWithoutReceivablePaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryUncheckedUpdateWithoutReceivablePaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entryNo?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumJournalStatusFieldUpdateOperationsInput | $Enums.JournalStatus;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isReversal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    reversesJournalEntryId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutJournalEntryNestedInput;
    vendorPayment?: Prisma.VendorPaymentUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorAllocation?: Prisma.VendorAllocationUncheckedUpdateOneWithoutJournalEntryNestedInput;
    vendorDefectiveReturn?: Prisma.VendorDefectiveReturnUncheckedUpdateOneWithoutJournalEntryNestedInput;
};
export type JournalEntryCountOutputType = {
    lines: number;
};
export type JournalEntryCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | JournalEntryCountOutputTypeCountLinesArgs;
};
export type JournalEntryCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryCountOutputTypeSelect<ExtArgs> | null;
};
export type JournalEntryCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryLineWhereInput;
};
export type JournalEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entryNo?: boolean;
    date?: boolean;
    description?: boolean;
    sourceRef?: boolean;
    notes?: boolean;
    status?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    isReversal?: boolean;
    reversesJournalEntryId?: boolean;
    lines?: boolean | Prisma.JournalEntry$linesArgs<ExtArgs>;
    vendorPayment?: boolean | Prisma.JournalEntry$vendorPaymentArgs<ExtArgs>;
    vendorAllocation?: boolean | Prisma.JournalEntry$vendorAllocationArgs<ExtArgs>;
    vendorDefectiveReturn?: boolean | Prisma.JournalEntry$vendorDefectiveReturnArgs<ExtArgs>;
    receivablePayment?: boolean | Prisma.JournalEntry$receivablePaymentArgs<ExtArgs>;
    _count?: boolean | Prisma.JournalEntryCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["journalEntry"]>;
export type JournalEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entryNo?: boolean;
    date?: boolean;
    description?: boolean;
    sourceRef?: boolean;
    notes?: boolean;
    status?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    isReversal?: boolean;
    reversesJournalEntryId?: boolean;
}, ExtArgs["result"]["journalEntry"]>;
export type JournalEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entryNo?: boolean;
    date?: boolean;
    description?: boolean;
    sourceRef?: boolean;
    notes?: boolean;
    status?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    isReversal?: boolean;
    reversesJournalEntryId?: boolean;
}, ExtArgs["result"]["journalEntry"]>;
export type JournalEntrySelectScalar = {
    id?: boolean;
    entryNo?: boolean;
    date?: boolean;
    description?: boolean;
    sourceRef?: boolean;
    notes?: boolean;
    status?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    isReversal?: boolean;
    reversesJournalEntryId?: boolean;
};
export type JournalEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "entryNo" | "date" | "description" | "sourceRef" | "notes" | "status" | "isManual" | "createdAt" | "isReversal" | "reversesJournalEntryId", ExtArgs["result"]["journalEntry"]>;
export type JournalEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.JournalEntry$linesArgs<ExtArgs>;
    vendorPayment?: boolean | Prisma.JournalEntry$vendorPaymentArgs<ExtArgs>;
    vendorAllocation?: boolean | Prisma.JournalEntry$vendorAllocationArgs<ExtArgs>;
    vendorDefectiveReturn?: boolean | Prisma.JournalEntry$vendorDefectiveReturnArgs<ExtArgs>;
    receivablePayment?: boolean | Prisma.JournalEntry$receivablePaymentArgs<ExtArgs>;
    _count?: boolean | Prisma.JournalEntryCountOutputTypeDefaultArgs<ExtArgs>;
};
export type JournalEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type JournalEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $JournalEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "JournalEntry";
    objects: {
        lines: Prisma.$JournalEntryLinePayload<ExtArgs>[];
        vendorPayment: Prisma.$VendorPaymentPayload<ExtArgs> | null;
        vendorAllocation: Prisma.$VendorAllocationPayload<ExtArgs> | null;
        vendorDefectiveReturn: Prisma.$VendorDefectiveReturnPayload<ExtArgs> | null;
        receivablePayment: Prisma.$ReceivablePaymentPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        entryNo: string;
        date: Date;
        description: string;
        sourceRef: string | null;
        notes: string | null;
        status: $Enums.JournalStatus;
        isManual: boolean;
        createdAt: Date;
        isReversal: boolean;
        reversesJournalEntryId: string | null;
    }, ExtArgs["result"]["journalEntry"]>;
    composites: {};
};
export type JournalEntryGetPayload<S extends boolean | null | undefined | JournalEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload, S>;
export type JournalEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<JournalEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: JournalEntryCountAggregateInputType | true;
};
export interface JournalEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['JournalEntry'];
        meta: {
            name: 'JournalEntry';
        };
    };
    findUnique<T extends JournalEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, JournalEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends JournalEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, JournalEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends JournalEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, JournalEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends JournalEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, JournalEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends JournalEntryFindManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends JournalEntryCreateArgs>(args: Prisma.SelectSubset<T, JournalEntryCreateArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends JournalEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends JournalEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, JournalEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends JournalEntryDeleteArgs>(args: Prisma.SelectSubset<T, JournalEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends JournalEntryUpdateArgs>(args: Prisma.SelectSubset<T, JournalEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends JournalEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, JournalEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends JournalEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, JournalEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends JournalEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, JournalEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends JournalEntryUpsertArgs>(args: Prisma.SelectSubset<T, JournalEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__JournalEntryClient<runtime.Types.Result.GetResult<Prisma.$JournalEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends JournalEntryCountArgs>(args?: Prisma.Subset<T, JournalEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], JournalEntryCountAggregateOutputType> : number>;
    aggregate<T extends JournalEntryAggregateArgs>(args: Prisma.Subset<T, JournalEntryAggregateArgs>): Prisma.PrismaPromise<GetJournalEntryAggregateType<T>>;
    groupBy<T extends JournalEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: JournalEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: JournalEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, JournalEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJournalEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: JournalEntryFieldRefs;
}
export interface Prisma__JournalEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.JournalEntry$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vendorPayment<T extends Prisma.JournalEntry$vendorPaymentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$vendorPaymentArgs<ExtArgs>>): Prisma.Prisma__VendorPaymentClient<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    vendorAllocation<T extends Prisma.JournalEntry$vendorAllocationArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$vendorAllocationArgs<ExtArgs>>): Prisma.Prisma__VendorAllocationClient<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    vendorDefectiveReturn<T extends Prisma.JournalEntry$vendorDefectiveReturnArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$vendorDefectiveReturnArgs<ExtArgs>>): Prisma.Prisma__VendorDefectiveReturnClient<runtime.Types.Result.GetResult<Prisma.$VendorDefectiveReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    receivablePayment<T extends Prisma.JournalEntry$receivablePaymentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.JournalEntry$receivablePaymentArgs<ExtArgs>>): Prisma.Prisma__ReceivablePaymentClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface JournalEntryFieldRefs {
    readonly id: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly entryNo: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly date: Prisma.FieldRef<"JournalEntry", 'DateTime'>;
    readonly description: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly sourceRef: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly notes: Prisma.FieldRef<"JournalEntry", 'String'>;
    readonly status: Prisma.FieldRef<"JournalEntry", 'JournalStatus'>;
    readonly isManual: Prisma.FieldRef<"JournalEntry", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"JournalEntry", 'DateTime'>;
    readonly isReversal: Prisma.FieldRef<"JournalEntry", 'Boolean'>;
    readonly reversesJournalEntryId: Prisma.FieldRef<"JournalEntry", 'String'>;
}
export type JournalEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithRelationInput | Prisma.JournalEntryOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryScalarFieldEnum | Prisma.JournalEntryScalarFieldEnum[];
};
export type JournalEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithRelationInput | Prisma.JournalEntryOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryScalarFieldEnum | Prisma.JournalEntryScalarFieldEnum[];
};
export type JournalEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryWhereInput;
    orderBy?: Prisma.JournalEntryOrderByWithRelationInput | Prisma.JournalEntryOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryScalarFieldEnum | Prisma.JournalEntryScalarFieldEnum[];
};
export type JournalEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryCreateInput, Prisma.JournalEntryUncheckedCreateInput>;
};
export type JournalEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.JournalEntryCreateManyInput | Prisma.JournalEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    data: Prisma.JournalEntryCreateManyInput | Prisma.JournalEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type JournalEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryUpdateInput, Prisma.JournalEntryUncheckedUpdateInput>;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.JournalEntryUpdateManyMutationInput, Prisma.JournalEntryUncheckedUpdateManyInput>;
    where?: Prisma.JournalEntryWhereInput;
    limit?: number;
};
export type JournalEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.JournalEntryUpdateManyMutationInput, Prisma.JournalEntryUncheckedUpdateManyInput>;
    where?: Prisma.JournalEntryWhereInput;
    limit?: number;
};
export type JournalEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.JournalEntryCreateInput, Prisma.JournalEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.JournalEntryUpdateInput, Prisma.JournalEntryUncheckedUpdateInput>;
};
export type JournalEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
    where: Prisma.JournalEntryWhereUniqueInput;
};
export type JournalEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryWhereInput;
    limit?: number;
};
export type JournalEntry$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryLineWhereInput;
    orderBy?: Prisma.JournalEntryLineOrderByWithRelationInput | Prisma.JournalEntryLineOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryLineScalarFieldEnum | Prisma.JournalEntryLineScalarFieldEnum[];
};
export type JournalEntry$vendorPaymentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorPaymentSelect<ExtArgs> | null;
    omit?: Prisma.VendorPaymentOmit<ExtArgs> | null;
    include?: Prisma.VendorPaymentInclude<ExtArgs> | null;
    where?: Prisma.VendorPaymentWhereInput;
};
export type JournalEntry$vendorAllocationArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationWhereInput;
};
export type JournalEntry$vendorDefectiveReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorDefectiveReturnSelect<ExtArgs> | null;
    omit?: Prisma.VendorDefectiveReturnOmit<ExtArgs> | null;
    include?: Prisma.VendorDefectiveReturnInclude<ExtArgs> | null;
    where?: Prisma.VendorDefectiveReturnWhereInput;
};
export type JournalEntry$receivablePaymentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePaymentWhereInput;
};
export type JournalEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntrySelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryInclude<ExtArgs> | null;
};
