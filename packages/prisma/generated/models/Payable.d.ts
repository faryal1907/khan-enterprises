import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type PayableModel = runtime.Types.Result.DefaultSelection<Prisma.$PayablePayload>;
export type AggregatePayable = {
    _count: PayableCountAggregateOutputType | null;
    _avg: PayableAvgAggregateOutputType | null;
    _sum: PayableSumAggregateOutputType | null;
    _min: PayableMinAggregateOutputType | null;
    _max: PayableMaxAggregateOutputType | null;
};
export type PayableAvgAggregateOutputType = {
    total: runtime.Decimal | null;
    paid: runtime.Decimal | null;
    remaining: runtime.Decimal | null;
};
export type PayableSumAggregateOutputType = {
    total: runtime.Decimal | null;
    paid: runtime.Decimal | null;
    remaining: runtime.Decimal | null;
};
export type PayableMinAggregateOutputType = {
    id: string | null;
    ref: string | null;
    type: $Enums.PayableType | null;
    partyName: string | null;
    description: string | null;
    total: runtime.Decimal | null;
    paid: runtime.Decimal | null;
    remaining: runtime.Decimal | null;
    dueDate: Date | null;
    status: $Enums.PaymentState | null;
    poId: string | null;
    expenseId: string | null;
};
export type PayableMaxAggregateOutputType = {
    id: string | null;
    ref: string | null;
    type: $Enums.PayableType | null;
    partyName: string | null;
    description: string | null;
    total: runtime.Decimal | null;
    paid: runtime.Decimal | null;
    remaining: runtime.Decimal | null;
    dueDate: Date | null;
    status: $Enums.PaymentState | null;
    poId: string | null;
    expenseId: string | null;
};
export type PayableCountAggregateOutputType = {
    id: number;
    ref: number;
    type: number;
    partyName: number;
    description: number;
    total: number;
    paid: number;
    remaining: number;
    dueDate: number;
    status: number;
    poId: number;
    expenseId: number;
    _all: number;
};
export type PayableAvgAggregateInputType = {
    total?: true;
    paid?: true;
    remaining?: true;
};
export type PayableSumAggregateInputType = {
    total?: true;
    paid?: true;
    remaining?: true;
};
export type PayableMinAggregateInputType = {
    id?: true;
    ref?: true;
    type?: true;
    partyName?: true;
    description?: true;
    total?: true;
    paid?: true;
    remaining?: true;
    dueDate?: true;
    status?: true;
    poId?: true;
    expenseId?: true;
};
export type PayableMaxAggregateInputType = {
    id?: true;
    ref?: true;
    type?: true;
    partyName?: true;
    description?: true;
    total?: true;
    paid?: true;
    remaining?: true;
    dueDate?: true;
    status?: true;
    poId?: true;
    expenseId?: true;
};
export type PayableCountAggregateInputType = {
    id?: true;
    ref?: true;
    type?: true;
    partyName?: true;
    description?: true;
    total?: true;
    paid?: true;
    remaining?: true;
    dueDate?: true;
    status?: true;
    poId?: true;
    expenseId?: true;
    _all?: true;
};
export type PayableAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PayableWhereInput;
    orderBy?: Prisma.PayableOrderByWithRelationInput | Prisma.PayableOrderByWithRelationInput[];
    cursor?: Prisma.PayableWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PayableCountAggregateInputType;
    _avg?: PayableAvgAggregateInputType;
    _sum?: PayableSumAggregateInputType;
    _min?: PayableMinAggregateInputType;
    _max?: PayableMaxAggregateInputType;
};
export type GetPayableAggregateType<T extends PayableAggregateArgs> = {
    [P in keyof T & keyof AggregatePayable]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePayable[P]> : Prisma.GetScalarType<T[P], AggregatePayable[P]>;
};
export type PayableGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PayableWhereInput;
    orderBy?: Prisma.PayableOrderByWithAggregationInput | Prisma.PayableOrderByWithAggregationInput[];
    by: Prisma.PayableScalarFieldEnum[] | Prisma.PayableScalarFieldEnum;
    having?: Prisma.PayableScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PayableCountAggregateInputType | true;
    _avg?: PayableAvgAggregateInputType;
    _sum?: PayableSumAggregateInputType;
    _min?: PayableMinAggregateInputType;
    _max?: PayableMaxAggregateInputType;
};
export type PayableGroupByOutputType = {
    id: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description: string | null;
    total: runtime.Decimal;
    paid: runtime.Decimal;
    remaining: runtime.Decimal;
    dueDate: Date | null;
    status: $Enums.PaymentState;
    poId: string | null;
    expenseId: string | null;
    _count: PayableCountAggregateOutputType | null;
    _avg: PayableAvgAggregateOutputType | null;
    _sum: PayableSumAggregateOutputType | null;
    _min: PayableMinAggregateOutputType | null;
    _max: PayableMaxAggregateOutputType | null;
};
export type GetPayableGroupByPayload<T extends PayableGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PayableGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PayableGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PayableGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PayableGroupByOutputType[P]>;
}>>;
export type PayableWhereInput = {
    AND?: Prisma.PayableWhereInput | Prisma.PayableWhereInput[];
    OR?: Prisma.PayableWhereInput[];
    NOT?: Prisma.PayableWhereInput | Prisma.PayableWhereInput[];
    id?: Prisma.StringFilter<"Payable"> | string;
    ref?: Prisma.StringFilter<"Payable"> | string;
    type?: Prisma.EnumPayableTypeFilter<"Payable"> | $Enums.PayableType;
    partyName?: Prisma.StringFilter<"Payable"> | string;
    description?: Prisma.StringNullableFilter<"Payable"> | string | null;
    total?: Prisma.DecimalFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.DateTimeNullableFilter<"Payable"> | Date | string | null;
    status?: Prisma.EnumPaymentStateFilter<"Payable"> | $Enums.PaymentState;
    poId?: Prisma.StringNullableFilter<"Payable"> | string | null;
    expenseId?: Prisma.StringNullableFilter<"Payable"> | string | null;
    purchaseOrder?: Prisma.XOR<Prisma.PurchaseOrderNullableScalarRelationFilter, Prisma.PurchaseOrderWhereInput> | null;
    allocations?: Prisma.PaymentAllocationListRelationFilter;
};
export type PayableOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    ref?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    partyName?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    poId?: Prisma.SortOrderInput | Prisma.SortOrder;
    expenseId?: Prisma.SortOrderInput | Prisma.SortOrder;
    purchaseOrder?: Prisma.PurchaseOrderOrderByWithRelationInput;
    allocations?: Prisma.PaymentAllocationOrderByRelationAggregateInput;
};
export type PayableWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    ref?: string;
    poId?: string;
    expenseId?: string;
    AND?: Prisma.PayableWhereInput | Prisma.PayableWhereInput[];
    OR?: Prisma.PayableWhereInput[];
    NOT?: Prisma.PayableWhereInput | Prisma.PayableWhereInput[];
    type?: Prisma.EnumPayableTypeFilter<"Payable"> | $Enums.PayableType;
    partyName?: Prisma.StringFilter<"Payable"> | string;
    description?: Prisma.StringNullableFilter<"Payable"> | string | null;
    total?: Prisma.DecimalFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.DateTimeNullableFilter<"Payable"> | Date | string | null;
    status?: Prisma.EnumPaymentStateFilter<"Payable"> | $Enums.PaymentState;
    purchaseOrder?: Prisma.XOR<Prisma.PurchaseOrderNullableScalarRelationFilter, Prisma.PurchaseOrderWhereInput> | null;
    allocations?: Prisma.PaymentAllocationListRelationFilter;
}, "id" | "ref" | "poId" | "expenseId">;
export type PayableOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    ref?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    partyName?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    poId?: Prisma.SortOrderInput | Prisma.SortOrder;
    expenseId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PayableCountOrderByAggregateInput;
    _avg?: Prisma.PayableAvgOrderByAggregateInput;
    _max?: Prisma.PayableMaxOrderByAggregateInput;
    _min?: Prisma.PayableMinOrderByAggregateInput;
    _sum?: Prisma.PayableSumOrderByAggregateInput;
};
export type PayableScalarWhereWithAggregatesInput = {
    AND?: Prisma.PayableScalarWhereWithAggregatesInput | Prisma.PayableScalarWhereWithAggregatesInput[];
    OR?: Prisma.PayableScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PayableScalarWhereWithAggregatesInput | Prisma.PayableScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Payable"> | string;
    ref?: Prisma.StringWithAggregatesFilter<"Payable"> | string;
    type?: Prisma.EnumPayableTypeWithAggregatesFilter<"Payable"> | $Enums.PayableType;
    partyName?: Prisma.StringWithAggregatesFilter<"Payable"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Payable"> | string | null;
    total?: Prisma.DecimalWithAggregatesFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalWithAggregatesFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalWithAggregatesFilter<"Payable"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Payable"> | Date | string | null;
    status?: Prisma.EnumPaymentStateWithAggregatesFilter<"Payable"> | $Enums.PaymentState;
    poId?: Prisma.StringNullableWithAggregatesFilter<"Payable"> | string | null;
    expenseId?: Prisma.StringNullableWithAggregatesFilter<"Payable"> | string | null;
};
export type PayableCreateInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    expenseId?: string | null;
    purchaseOrder?: Prisma.PurchaseOrderCreateNestedOneWithoutPayableInput;
    allocations?: Prisma.PaymentAllocationCreateNestedManyWithoutPayableInput;
};
export type PayableUncheckedCreateInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    poId?: string | null;
    expenseId?: string | null;
    allocations?: Prisma.PaymentAllocationUncheckedCreateNestedManyWithoutPayableInput;
};
export type PayableUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrder?: Prisma.PurchaseOrderUpdateOneWithoutPayableNestedInput;
    allocations?: Prisma.PaymentAllocationUpdateManyWithoutPayableNestedInput;
};
export type PayableUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    poId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocations?: Prisma.PaymentAllocationUncheckedUpdateManyWithoutPayableNestedInput;
};
export type PayableCreateManyInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    poId?: string | null;
    expenseId?: string | null;
};
export type PayableUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PayableUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    poId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PayableNullableScalarRelationFilter = {
    is?: Prisma.PayableWhereInput | null;
    isNot?: Prisma.PayableWhereInput | null;
};
export type PayableCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ref?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    partyName?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    poId?: Prisma.SortOrder;
    expenseId?: Prisma.SortOrder;
};
export type PayableAvgOrderByAggregateInput = {
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
};
export type PayableMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ref?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    partyName?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    poId?: Prisma.SortOrder;
    expenseId?: Prisma.SortOrder;
};
export type PayableMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ref?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    partyName?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    poId?: Prisma.SortOrder;
    expenseId?: Prisma.SortOrder;
};
export type PayableSumOrderByAggregateInput = {
    total?: Prisma.SortOrder;
    paid?: Prisma.SortOrder;
    remaining?: Prisma.SortOrder;
};
export type PayableCreateNestedOneWithoutPurchaseOrderInput = {
    create?: Prisma.XOR<Prisma.PayableCreateWithoutPurchaseOrderInput, Prisma.PayableUncheckedCreateWithoutPurchaseOrderInput>;
    connectOrCreate?: Prisma.PayableCreateOrConnectWithoutPurchaseOrderInput;
    connect?: Prisma.PayableWhereUniqueInput;
};
export type PayableUncheckedCreateNestedOneWithoutPurchaseOrderInput = {
    create?: Prisma.XOR<Prisma.PayableCreateWithoutPurchaseOrderInput, Prisma.PayableUncheckedCreateWithoutPurchaseOrderInput>;
    connectOrCreate?: Prisma.PayableCreateOrConnectWithoutPurchaseOrderInput;
    connect?: Prisma.PayableWhereUniqueInput;
};
export type PayableUpdateOneWithoutPurchaseOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PayableCreateWithoutPurchaseOrderInput, Prisma.PayableUncheckedCreateWithoutPurchaseOrderInput>;
    connectOrCreate?: Prisma.PayableCreateOrConnectWithoutPurchaseOrderInput;
    upsert?: Prisma.PayableUpsertWithoutPurchaseOrderInput;
    disconnect?: Prisma.PayableWhereInput | boolean;
    delete?: Prisma.PayableWhereInput | boolean;
    connect?: Prisma.PayableWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PayableUpdateToOneWithWhereWithoutPurchaseOrderInput, Prisma.PayableUpdateWithoutPurchaseOrderInput>, Prisma.PayableUncheckedUpdateWithoutPurchaseOrderInput>;
};
export type PayableUncheckedUpdateOneWithoutPurchaseOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PayableCreateWithoutPurchaseOrderInput, Prisma.PayableUncheckedCreateWithoutPurchaseOrderInput>;
    connectOrCreate?: Prisma.PayableCreateOrConnectWithoutPurchaseOrderInput;
    upsert?: Prisma.PayableUpsertWithoutPurchaseOrderInput;
    disconnect?: Prisma.PayableWhereInput | boolean;
    delete?: Prisma.PayableWhereInput | boolean;
    connect?: Prisma.PayableWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PayableUpdateToOneWithWhereWithoutPurchaseOrderInput, Prisma.PayableUpdateWithoutPurchaseOrderInput>, Prisma.PayableUncheckedUpdateWithoutPurchaseOrderInput>;
};
export type EnumPayableTypeFieldUpdateOperationsInput = {
    set?: $Enums.PayableType;
};
export type PayableCreateNestedOneWithoutAllocationsInput = {
    create?: Prisma.XOR<Prisma.PayableCreateWithoutAllocationsInput, Prisma.PayableUncheckedCreateWithoutAllocationsInput>;
    connectOrCreate?: Prisma.PayableCreateOrConnectWithoutAllocationsInput;
    connect?: Prisma.PayableWhereUniqueInput;
};
export type PayableUpdateOneWithoutAllocationsNestedInput = {
    create?: Prisma.XOR<Prisma.PayableCreateWithoutAllocationsInput, Prisma.PayableUncheckedCreateWithoutAllocationsInput>;
    connectOrCreate?: Prisma.PayableCreateOrConnectWithoutAllocationsInput;
    upsert?: Prisma.PayableUpsertWithoutAllocationsInput;
    disconnect?: Prisma.PayableWhereInput | boolean;
    delete?: Prisma.PayableWhereInput | boolean;
    connect?: Prisma.PayableWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PayableUpdateToOneWithWhereWithoutAllocationsInput, Prisma.PayableUpdateWithoutAllocationsInput>, Prisma.PayableUncheckedUpdateWithoutAllocationsInput>;
};
export type PayableCreateWithoutPurchaseOrderInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    expenseId?: string | null;
    allocations?: Prisma.PaymentAllocationCreateNestedManyWithoutPayableInput;
};
export type PayableUncheckedCreateWithoutPurchaseOrderInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    expenseId?: string | null;
    allocations?: Prisma.PaymentAllocationUncheckedCreateNestedManyWithoutPayableInput;
};
export type PayableCreateOrConnectWithoutPurchaseOrderInput = {
    where: Prisma.PayableWhereUniqueInput;
    create: Prisma.XOR<Prisma.PayableCreateWithoutPurchaseOrderInput, Prisma.PayableUncheckedCreateWithoutPurchaseOrderInput>;
};
export type PayableUpsertWithoutPurchaseOrderInput = {
    update: Prisma.XOR<Prisma.PayableUpdateWithoutPurchaseOrderInput, Prisma.PayableUncheckedUpdateWithoutPurchaseOrderInput>;
    create: Prisma.XOR<Prisma.PayableCreateWithoutPurchaseOrderInput, Prisma.PayableUncheckedCreateWithoutPurchaseOrderInput>;
    where?: Prisma.PayableWhereInput;
};
export type PayableUpdateToOneWithWhereWithoutPurchaseOrderInput = {
    where?: Prisma.PayableWhereInput;
    data: Prisma.XOR<Prisma.PayableUpdateWithoutPurchaseOrderInput, Prisma.PayableUncheckedUpdateWithoutPurchaseOrderInput>;
};
export type PayableUpdateWithoutPurchaseOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocations?: Prisma.PaymentAllocationUpdateManyWithoutPayableNestedInput;
};
export type PayableUncheckedUpdateWithoutPurchaseOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocations?: Prisma.PaymentAllocationUncheckedUpdateManyWithoutPayableNestedInput;
};
export type PayableCreateWithoutAllocationsInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    expenseId?: string | null;
    purchaseOrder?: Prisma.PurchaseOrderCreateNestedOneWithoutPayableInput;
};
export type PayableUncheckedCreateWithoutAllocationsInput = {
    id?: string;
    ref: string;
    type: $Enums.PayableType;
    partyName: string;
    description?: string | null;
    total: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining: runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Date | string | null;
    status?: $Enums.PaymentState;
    poId?: string | null;
    expenseId?: string | null;
};
export type PayableCreateOrConnectWithoutAllocationsInput = {
    where: Prisma.PayableWhereUniqueInput;
    create: Prisma.XOR<Prisma.PayableCreateWithoutAllocationsInput, Prisma.PayableUncheckedCreateWithoutAllocationsInput>;
};
export type PayableUpsertWithoutAllocationsInput = {
    update: Prisma.XOR<Prisma.PayableUpdateWithoutAllocationsInput, Prisma.PayableUncheckedUpdateWithoutAllocationsInput>;
    create: Prisma.XOR<Prisma.PayableCreateWithoutAllocationsInput, Prisma.PayableUncheckedCreateWithoutAllocationsInput>;
    where?: Prisma.PayableWhereInput;
};
export type PayableUpdateToOneWithWhereWithoutAllocationsInput = {
    where?: Prisma.PayableWhereInput;
    data: Prisma.XOR<Prisma.PayableUpdateWithoutAllocationsInput, Prisma.PayableUncheckedUpdateWithoutAllocationsInput>;
};
export type PayableUpdateWithoutAllocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    purchaseOrder?: Prisma.PurchaseOrderUpdateOneWithoutPayableNestedInput;
};
export type PayableUncheckedUpdateWithoutAllocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ref?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayableTypeFieldUpdateOperationsInput | $Enums.PayableType;
    partyName?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paid?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remaining?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    dueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    poId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expenseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PayableCountOutputType = {
    allocations: number;
};
export type PayableCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    allocations?: boolean | PayableCountOutputTypeCountAllocationsArgs;
};
export type PayableCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableCountOutputTypeSelect<ExtArgs> | null;
};
export type PayableCountOutputTypeCountAllocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentAllocationWhereInput;
};
export type PayableSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ref?: boolean;
    type?: boolean;
    partyName?: boolean;
    description?: boolean;
    total?: boolean;
    paid?: boolean;
    remaining?: boolean;
    dueDate?: boolean;
    status?: boolean;
    poId?: boolean;
    expenseId?: boolean;
    purchaseOrder?: boolean | Prisma.Payable$purchaseOrderArgs<ExtArgs>;
    allocations?: boolean | Prisma.Payable$allocationsArgs<ExtArgs>;
    _count?: boolean | Prisma.PayableCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["payable"]>;
export type PayableSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ref?: boolean;
    type?: boolean;
    partyName?: boolean;
    description?: boolean;
    total?: boolean;
    paid?: boolean;
    remaining?: boolean;
    dueDate?: boolean;
    status?: boolean;
    poId?: boolean;
    expenseId?: boolean;
    purchaseOrder?: boolean | Prisma.Payable$purchaseOrderArgs<ExtArgs>;
}, ExtArgs["result"]["payable"]>;
export type PayableSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ref?: boolean;
    type?: boolean;
    partyName?: boolean;
    description?: boolean;
    total?: boolean;
    paid?: boolean;
    remaining?: boolean;
    dueDate?: boolean;
    status?: boolean;
    poId?: boolean;
    expenseId?: boolean;
    purchaseOrder?: boolean | Prisma.Payable$purchaseOrderArgs<ExtArgs>;
}, ExtArgs["result"]["payable"]>;
export type PayableSelectScalar = {
    id?: boolean;
    ref?: boolean;
    type?: boolean;
    partyName?: boolean;
    description?: boolean;
    total?: boolean;
    paid?: boolean;
    remaining?: boolean;
    dueDate?: boolean;
    status?: boolean;
    poId?: boolean;
    expenseId?: boolean;
};
export type PayableOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "ref" | "type" | "partyName" | "description" | "total" | "paid" | "remaining" | "dueDate" | "status" | "poId" | "expenseId", ExtArgs["result"]["payable"]>;
export type PayableInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrder?: boolean | Prisma.Payable$purchaseOrderArgs<ExtArgs>;
    allocations?: boolean | Prisma.Payable$allocationsArgs<ExtArgs>;
    _count?: boolean | Prisma.PayableCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PayableIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrder?: boolean | Prisma.Payable$purchaseOrderArgs<ExtArgs>;
};
export type PayableIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    purchaseOrder?: boolean | Prisma.Payable$purchaseOrderArgs<ExtArgs>;
};
export type $PayablePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Payable";
    objects: {
        purchaseOrder: Prisma.$PurchaseOrderPayload<ExtArgs> | null;
        allocations: Prisma.$PaymentAllocationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        ref: string;
        type: $Enums.PayableType;
        partyName: string;
        description: string | null;
        total: runtime.Decimal;
        paid: runtime.Decimal;
        remaining: runtime.Decimal;
        dueDate: Date | null;
        status: $Enums.PaymentState;
        poId: string | null;
        expenseId: string | null;
    }, ExtArgs["result"]["payable"]>;
    composites: {};
};
export type PayableGetPayload<S extends boolean | null | undefined | PayableDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PayablePayload, S>;
export type PayableCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PayableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PayableCountAggregateInputType | true;
};
export interface PayableDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Payable'];
        meta: {
            name: 'Payable';
        };
    };
    findUnique<T extends PayableFindUniqueArgs>(args: Prisma.SelectSubset<T, PayableFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PayableFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PayableFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PayableFindFirstArgs>(args?: Prisma.SelectSubset<T, PayableFindFirstArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PayableFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PayableFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PayableFindManyArgs>(args?: Prisma.SelectSubset<T, PayableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PayableCreateArgs>(args: Prisma.SelectSubset<T, PayableCreateArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PayableCreateManyArgs>(args?: Prisma.SelectSubset<T, PayableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PayableCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PayableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PayableDeleteArgs>(args: Prisma.SelectSubset<T, PayableDeleteArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PayableUpdateArgs>(args: Prisma.SelectSubset<T, PayableUpdateArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PayableDeleteManyArgs>(args?: Prisma.SelectSubset<T, PayableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PayableUpdateManyArgs>(args: Prisma.SelectSubset<T, PayableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PayableUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PayableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PayableUpsertArgs>(args: Prisma.SelectSubset<T, PayableUpsertArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PayableCountArgs>(args?: Prisma.Subset<T, PayableCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PayableCountAggregateOutputType> : number>;
    aggregate<T extends PayableAggregateArgs>(args: Prisma.Subset<T, PayableAggregateArgs>): Prisma.PrismaPromise<GetPayableAggregateType<T>>;
    groupBy<T extends PayableGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PayableGroupByArgs['orderBy'];
    } : {
        orderBy?: PayableGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PayableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PayableFieldRefs;
}
export interface Prisma__PayableClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    purchaseOrder<T extends Prisma.Payable$purchaseOrderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Payable$purchaseOrderArgs<ExtArgs>>): Prisma.Prisma__PurchaseOrderClient<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    allocations<T extends Prisma.Payable$allocationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Payable$allocationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PayableFieldRefs {
    readonly id: Prisma.FieldRef<"Payable", 'String'>;
    readonly ref: Prisma.FieldRef<"Payable", 'String'>;
    readonly type: Prisma.FieldRef<"Payable", 'PayableType'>;
    readonly partyName: Prisma.FieldRef<"Payable", 'String'>;
    readonly description: Prisma.FieldRef<"Payable", 'String'>;
    readonly total: Prisma.FieldRef<"Payable", 'Decimal'>;
    readonly paid: Prisma.FieldRef<"Payable", 'Decimal'>;
    readonly remaining: Prisma.FieldRef<"Payable", 'Decimal'>;
    readonly dueDate: Prisma.FieldRef<"Payable", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Payable", 'PaymentState'>;
    readonly poId: Prisma.FieldRef<"Payable", 'String'>;
    readonly expenseId: Prisma.FieldRef<"Payable", 'String'>;
}
export type PayableFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where: Prisma.PayableWhereUniqueInput;
};
export type PayableFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where: Prisma.PayableWhereUniqueInput;
};
export type PayableFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where?: Prisma.PayableWhereInput;
    orderBy?: Prisma.PayableOrderByWithRelationInput | Prisma.PayableOrderByWithRelationInput[];
    cursor?: Prisma.PayableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PayableScalarFieldEnum | Prisma.PayableScalarFieldEnum[];
};
export type PayableFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where?: Prisma.PayableWhereInput;
    orderBy?: Prisma.PayableOrderByWithRelationInput | Prisma.PayableOrderByWithRelationInput[];
    cursor?: Prisma.PayableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PayableScalarFieldEnum | Prisma.PayableScalarFieldEnum[];
};
export type PayableFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where?: Prisma.PayableWhereInput;
    orderBy?: Prisma.PayableOrderByWithRelationInput | Prisma.PayableOrderByWithRelationInput[];
    cursor?: Prisma.PayableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PayableScalarFieldEnum | Prisma.PayableScalarFieldEnum[];
};
export type PayableCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PayableCreateInput, Prisma.PayableUncheckedCreateInput>;
};
export type PayableCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PayableCreateManyInput | Prisma.PayableCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PayableCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    data: Prisma.PayableCreateManyInput | Prisma.PayableCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PayableIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PayableUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PayableUpdateInput, Prisma.PayableUncheckedUpdateInput>;
    where: Prisma.PayableWhereUniqueInput;
};
export type PayableUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PayableUpdateManyMutationInput, Prisma.PayableUncheckedUpdateManyInput>;
    where?: Prisma.PayableWhereInput;
    limit?: number;
};
export type PayableUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PayableUpdateManyMutationInput, Prisma.PayableUncheckedUpdateManyInput>;
    where?: Prisma.PayableWhereInput;
    limit?: number;
    include?: Prisma.PayableIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PayableUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where: Prisma.PayableWhereUniqueInput;
    create: Prisma.XOR<Prisma.PayableCreateInput, Prisma.PayableUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PayableUpdateInput, Prisma.PayableUncheckedUpdateInput>;
};
export type PayableDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where: Prisma.PayableWhereUniqueInput;
};
export type PayableDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PayableWhereInput;
    limit?: number;
};
export type Payable$purchaseOrderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderWhereInput;
};
export type Payable$allocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    where?: Prisma.PaymentAllocationWhereInput;
    orderBy?: Prisma.PaymentAllocationOrderByWithRelationInput | Prisma.PaymentAllocationOrderByWithRelationInput[];
    cursor?: Prisma.PaymentAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentAllocationScalarFieldEnum | Prisma.PaymentAllocationScalarFieldEnum[];
};
export type PayableDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
};
