import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type PaymentAllocationModel = runtime.Types.Result.DefaultSelection<Prisma.$PaymentAllocationPayload>;
export type AggregatePaymentAllocation = {
    _count: PaymentAllocationCountAggregateOutputType | null;
    _avg: PaymentAllocationAvgAggregateOutputType | null;
    _sum: PaymentAllocationSumAggregateOutputType | null;
    _min: PaymentAllocationMinAggregateOutputType | null;
    _max: PaymentAllocationMaxAggregateOutputType | null;
};
export type PaymentAllocationAvgAggregateOutputType = {
    allocatedAmount: runtime.Decimal | null;
};
export type PaymentAllocationSumAggregateOutputType = {
    allocatedAmount: runtime.Decimal | null;
};
export type PaymentAllocationMinAggregateOutputType = {
    id: string | null;
    paymentId: string | null;
    orderId: string | null;
    partOrderId: string | null;
    payableId: string | null;
    allocatedAmount: runtime.Decimal | null;
    partPaymentTransactionId: string | null;
};
export type PaymentAllocationMaxAggregateOutputType = {
    id: string | null;
    paymentId: string | null;
    orderId: string | null;
    partOrderId: string | null;
    payableId: string | null;
    allocatedAmount: runtime.Decimal | null;
    partPaymentTransactionId: string | null;
};
export type PaymentAllocationCountAggregateOutputType = {
    id: number;
    paymentId: number;
    orderId: number;
    partOrderId: number;
    payableId: number;
    allocatedAmount: number;
    partPaymentTransactionId: number;
    _all: number;
};
export type PaymentAllocationAvgAggregateInputType = {
    allocatedAmount?: true;
};
export type PaymentAllocationSumAggregateInputType = {
    allocatedAmount?: true;
};
export type PaymentAllocationMinAggregateInputType = {
    id?: true;
    paymentId?: true;
    orderId?: true;
    partOrderId?: true;
    payableId?: true;
    allocatedAmount?: true;
    partPaymentTransactionId?: true;
};
export type PaymentAllocationMaxAggregateInputType = {
    id?: true;
    paymentId?: true;
    orderId?: true;
    partOrderId?: true;
    payableId?: true;
    allocatedAmount?: true;
    partPaymentTransactionId?: true;
};
export type PaymentAllocationCountAggregateInputType = {
    id?: true;
    paymentId?: true;
    orderId?: true;
    partOrderId?: true;
    payableId?: true;
    allocatedAmount?: true;
    partPaymentTransactionId?: true;
    _all?: true;
};
export type PaymentAllocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentAllocationWhereInput;
    orderBy?: Prisma.PaymentAllocationOrderByWithRelationInput | Prisma.PaymentAllocationOrderByWithRelationInput[];
    cursor?: Prisma.PaymentAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PaymentAllocationCountAggregateInputType;
    _avg?: PaymentAllocationAvgAggregateInputType;
    _sum?: PaymentAllocationSumAggregateInputType;
    _min?: PaymentAllocationMinAggregateInputType;
    _max?: PaymentAllocationMaxAggregateInputType;
};
export type GetPaymentAllocationAggregateType<T extends PaymentAllocationAggregateArgs> = {
    [P in keyof T & keyof AggregatePaymentAllocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePaymentAllocation[P]> : Prisma.GetScalarType<T[P], AggregatePaymentAllocation[P]>;
};
export type PaymentAllocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentAllocationWhereInput;
    orderBy?: Prisma.PaymentAllocationOrderByWithAggregationInput | Prisma.PaymentAllocationOrderByWithAggregationInput[];
    by: Prisma.PaymentAllocationScalarFieldEnum[] | Prisma.PaymentAllocationScalarFieldEnum;
    having?: Prisma.PaymentAllocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaymentAllocationCountAggregateInputType | true;
    _avg?: PaymentAllocationAvgAggregateInputType;
    _sum?: PaymentAllocationSumAggregateInputType;
    _min?: PaymentAllocationMinAggregateInputType;
    _max?: PaymentAllocationMaxAggregateInputType;
};
export type PaymentAllocationGroupByOutputType = {
    id: string;
    paymentId: string;
    orderId: string | null;
    partOrderId: string | null;
    payableId: string | null;
    allocatedAmount: runtime.Decimal;
    partPaymentTransactionId: string | null;
    _count: PaymentAllocationCountAggregateOutputType | null;
    _avg: PaymentAllocationAvgAggregateOutputType | null;
    _sum: PaymentAllocationSumAggregateOutputType | null;
    _min: PaymentAllocationMinAggregateOutputType | null;
    _max: PaymentAllocationMaxAggregateOutputType | null;
};
export type GetPaymentAllocationGroupByPayload<T extends PaymentAllocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PaymentAllocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PaymentAllocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PaymentAllocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PaymentAllocationGroupByOutputType[P]>;
}>>;
export type PaymentAllocationWhereInput = {
    AND?: Prisma.PaymentAllocationWhereInput | Prisma.PaymentAllocationWhereInput[];
    OR?: Prisma.PaymentAllocationWhereInput[];
    NOT?: Prisma.PaymentAllocationWhereInput | Prisma.PaymentAllocationWhereInput[];
    id?: Prisma.StringFilter<"PaymentAllocation"> | string;
    paymentId?: Prisma.StringFilter<"PaymentAllocation"> | string;
    orderId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    payableId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    allocatedAmount?: Prisma.DecimalFilter<"PaymentAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    payment?: Prisma.XOR<Prisma.PaymentTransactionScalarRelationFilter, Prisma.PaymentTransactionWhereInput>;
    order?: Prisma.XOR<Prisma.OrderNullableScalarRelationFilter, Prisma.OrderWhereInput> | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderNullableScalarRelationFilter, Prisma.PartOrderWhereInput> | null;
    payable?: Prisma.XOR<Prisma.PayableNullableScalarRelationFilter, Prisma.PayableWhereInput> | null;
    partPaymentTransaction?: Prisma.XOR<Prisma.PartPaymentTransactionNullableScalarRelationFilter, Prisma.PartPaymentTransactionWhereInput> | null;
};
export type PaymentAllocationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    orderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    payableId?: Prisma.SortOrderInput | Prisma.SortOrder;
    allocatedAmount?: Prisma.SortOrder;
    partPaymentTransactionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    payment?: Prisma.PaymentTransactionOrderByWithRelationInput;
    order?: Prisma.OrderOrderByWithRelationInput;
    partOrder?: Prisma.PartOrderOrderByWithRelationInput;
    payable?: Prisma.PayableOrderByWithRelationInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionOrderByWithRelationInput;
};
export type PaymentAllocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PaymentAllocationWhereInput | Prisma.PaymentAllocationWhereInput[];
    OR?: Prisma.PaymentAllocationWhereInput[];
    NOT?: Prisma.PaymentAllocationWhereInput | Prisma.PaymentAllocationWhereInput[];
    paymentId?: Prisma.StringFilter<"PaymentAllocation"> | string;
    orderId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    payableId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    allocatedAmount?: Prisma.DecimalFilter<"PaymentAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    payment?: Prisma.XOR<Prisma.PaymentTransactionScalarRelationFilter, Prisma.PaymentTransactionWhereInput>;
    order?: Prisma.XOR<Prisma.OrderNullableScalarRelationFilter, Prisma.OrderWhereInput> | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderNullableScalarRelationFilter, Prisma.PartOrderWhereInput> | null;
    payable?: Prisma.XOR<Prisma.PayableNullableScalarRelationFilter, Prisma.PayableWhereInput> | null;
    partPaymentTransaction?: Prisma.XOR<Prisma.PartPaymentTransactionNullableScalarRelationFilter, Prisma.PartPaymentTransactionWhereInput> | null;
}, "id">;
export type PaymentAllocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    orderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    payableId?: Prisma.SortOrderInput | Prisma.SortOrder;
    allocatedAmount?: Prisma.SortOrder;
    partPaymentTransactionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PaymentAllocationCountOrderByAggregateInput;
    _avg?: Prisma.PaymentAllocationAvgOrderByAggregateInput;
    _max?: Prisma.PaymentAllocationMaxOrderByAggregateInput;
    _min?: Prisma.PaymentAllocationMinOrderByAggregateInput;
    _sum?: Prisma.PaymentAllocationSumOrderByAggregateInput;
};
export type PaymentAllocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.PaymentAllocationScalarWhereWithAggregatesInput | Prisma.PaymentAllocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.PaymentAllocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PaymentAllocationScalarWhereWithAggregatesInput | Prisma.PaymentAllocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PaymentAllocation"> | string;
    paymentId?: Prisma.StringWithAggregatesFilter<"PaymentAllocation"> | string;
    orderId?: Prisma.StringNullableWithAggregatesFilter<"PaymentAllocation"> | string | null;
    partOrderId?: Prisma.StringNullableWithAggregatesFilter<"PaymentAllocation"> | string | null;
    payableId?: Prisma.StringNullableWithAggregatesFilter<"PaymentAllocation"> | string | null;
    allocatedAmount?: Prisma.DecimalWithAggregatesFilter<"PaymentAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.StringNullableWithAggregatesFilter<"PaymentAllocation"> | string | null;
};
export type PaymentAllocationCreateInput = {
    id?: string;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment: Prisma.PaymentTransactionCreateNestedOneWithoutAllocationsInput;
    order?: Prisma.OrderCreateNestedOneWithoutAllocationsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAllocationsInput;
    payable?: Prisma.PayableCreateNestedOneWithoutAllocationsInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionCreateNestedOneWithoutAllocationsInput;
};
export type PaymentAllocationUncheckedCreateInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment?: Prisma.PaymentTransactionUpdateOneRequiredWithoutAllocationsNestedInput;
    order?: Prisma.OrderUpdateOneWithoutAllocationsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAllocationsNestedInput;
    payable?: Prisma.PayableUpdateOneWithoutAllocationsNestedInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionUpdateOneWithoutAllocationsNestedInput;
};
export type PaymentAllocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationCreateManyInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PaymentAllocationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationListRelationFilter = {
    every?: Prisma.PaymentAllocationWhereInput;
    some?: Prisma.PaymentAllocationWhereInput;
    none?: Prisma.PaymentAllocationWhereInput;
};
export type PaymentAllocationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PaymentAllocationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    payableId?: Prisma.SortOrder;
    allocatedAmount?: Prisma.SortOrder;
    partPaymentTransactionId?: Prisma.SortOrder;
};
export type PaymentAllocationAvgOrderByAggregateInput = {
    allocatedAmount?: Prisma.SortOrder;
};
export type PaymentAllocationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    payableId?: Prisma.SortOrder;
    allocatedAmount?: Prisma.SortOrder;
    partPaymentTransactionId?: Prisma.SortOrder;
};
export type PaymentAllocationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    payableId?: Prisma.SortOrder;
    allocatedAmount?: Prisma.SortOrder;
    partPaymentTransactionId?: Prisma.SortOrder;
};
export type PaymentAllocationSumOrderByAggregateInput = {
    allocatedAmount?: Prisma.SortOrder;
};
export type PaymentAllocationCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput> | Prisma.PaymentAllocationCreateWithoutOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyOrderInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUncheckedCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput> | Prisma.PaymentAllocationCreateWithoutOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyOrderInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput> | Prisma.PaymentAllocationCreateWithoutOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutOrderInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyOrderInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutOrderInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutOrderInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput> | Prisma.PaymentAllocationCreateWithoutOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutOrderInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyOrderInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutOrderInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutOrderInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationCreateNestedManyWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput> | Prisma.PaymentAllocationCreateWithoutPartOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartOrderInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUncheckedCreateNestedManyWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput> | Prisma.PaymentAllocationCreateWithoutPartOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartOrderInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUpdateManyWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput> | Prisma.PaymentAllocationCreateWithoutPartOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartOrderInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartOrderInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartOrderInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartOrderInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartOrderInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartOrderInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationUncheckedUpdateManyWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput> | Prisma.PaymentAllocationCreateWithoutPartOrderInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartOrderInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartOrderInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartOrderInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartOrderInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartOrderInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartOrderInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartOrderInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartOrderInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationCreateNestedManyWithoutPaymentInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput> | Prisma.PaymentAllocationCreateWithoutPaymentInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput | Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPaymentInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUncheckedCreateNestedManyWithoutPaymentInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput> | Prisma.PaymentAllocationCreateWithoutPaymentInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput | Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPaymentInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUpdateManyWithoutPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput> | Prisma.PaymentAllocationCreateWithoutPaymentInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput | Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPaymentInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPaymentInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPaymentInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPaymentInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPaymentInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPaymentInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPaymentInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationUncheckedUpdateManyWithoutPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput> | Prisma.PaymentAllocationCreateWithoutPaymentInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput | Prisma.PaymentAllocationCreateOrConnectWithoutPaymentInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPaymentInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPaymentInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPaymentInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPaymentInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPaymentInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPaymentInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPaymentInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationCreateNestedManyWithoutPartPaymentTransactionInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput> | Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartPaymentTransactionInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUncheckedCreateNestedManyWithoutPartPaymentTransactionInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput> | Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartPaymentTransactionInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUpdateManyWithoutPartPaymentTransactionNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput> | Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartPaymentTransactionInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartPaymentTransactionInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartPaymentTransactionInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartPaymentTransactionInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationUncheckedUpdateManyWithoutPartPaymentTransactionNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput> | Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPartPaymentTransactionInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPartPaymentTransactionInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPartPaymentTransactionInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartPaymentTransactionInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPartPaymentTransactionInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationCreateNestedManyWithoutPayableInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPayableInput, Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput> | Prisma.PaymentAllocationCreateWithoutPayableInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput | Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPayableInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUncheckedCreateNestedManyWithoutPayableInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPayableInput, Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput> | Prisma.PaymentAllocationCreateWithoutPayableInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput | Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPayableInputEnvelope;
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
};
export type PaymentAllocationUpdateManyWithoutPayableNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPayableInput, Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput> | Prisma.PaymentAllocationCreateWithoutPayableInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput | Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPayableInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPayableInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPayableInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPayableInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPayableInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPayableInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPayableInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationUncheckedUpdateManyWithoutPayableNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPayableInput, Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput> | Prisma.PaymentAllocationCreateWithoutPayableInput[] | Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput[];
    connectOrCreate?: Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput | Prisma.PaymentAllocationCreateOrConnectWithoutPayableInput[];
    upsert?: Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPayableInput | Prisma.PaymentAllocationUpsertWithWhereUniqueWithoutPayableInput[];
    createMany?: Prisma.PaymentAllocationCreateManyPayableInputEnvelope;
    set?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    disconnect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    delete?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    connect?: Prisma.PaymentAllocationWhereUniqueInput | Prisma.PaymentAllocationWhereUniqueInput[];
    update?: Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPayableInput | Prisma.PaymentAllocationUpdateWithWhereUniqueWithoutPayableInput[];
    updateMany?: Prisma.PaymentAllocationUpdateManyWithWhereWithoutPayableInput | Prisma.PaymentAllocationUpdateManyWithWhereWithoutPayableInput[];
    deleteMany?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
};
export type PaymentAllocationCreateWithoutOrderInput = {
    id?: string;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment: Prisma.PaymentTransactionCreateNestedOneWithoutAllocationsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAllocationsInput;
    payable?: Prisma.PayableCreateNestedOneWithoutAllocationsInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionCreateNestedOneWithoutAllocationsInput;
};
export type PaymentAllocationUncheckedCreateWithoutOrderInput = {
    id?: string;
    paymentId: string;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationCreateOrConnectWithoutOrderInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput>;
};
export type PaymentAllocationCreateManyOrderInputEnvelope = {
    data: Prisma.PaymentAllocationCreateManyOrderInput | Prisma.PaymentAllocationCreateManyOrderInput[];
    skipDuplicates?: boolean;
};
export type PaymentAllocationUpsertWithWhereUniqueWithoutOrderInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutOrderInput, Prisma.PaymentAllocationUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutOrderInput>;
};
export type PaymentAllocationUpdateWithWhereUniqueWithoutOrderInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutOrderInput, Prisma.PaymentAllocationUncheckedUpdateWithoutOrderInput>;
};
export type PaymentAllocationUpdateManyWithWhereWithoutOrderInput = {
    where: Prisma.PaymentAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyWithoutOrderInput>;
};
export type PaymentAllocationScalarWhereInput = {
    AND?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
    OR?: Prisma.PaymentAllocationScalarWhereInput[];
    NOT?: Prisma.PaymentAllocationScalarWhereInput | Prisma.PaymentAllocationScalarWhereInput[];
    id?: Prisma.StringFilter<"PaymentAllocation"> | string;
    paymentId?: Prisma.StringFilter<"PaymentAllocation"> | string;
    orderId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    payableId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
    allocatedAmount?: Prisma.DecimalFilter<"PaymentAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.StringNullableFilter<"PaymentAllocation"> | string | null;
};
export type PaymentAllocationCreateWithoutPartOrderInput = {
    id?: string;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment: Prisma.PaymentTransactionCreateNestedOneWithoutAllocationsInput;
    order?: Prisma.OrderCreateNestedOneWithoutAllocationsInput;
    payable?: Prisma.PayableCreateNestedOneWithoutAllocationsInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionCreateNestedOneWithoutAllocationsInput;
};
export type PaymentAllocationUncheckedCreateWithoutPartOrderInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationCreateOrConnectWithoutPartOrderInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput>;
};
export type PaymentAllocationCreateManyPartOrderInputEnvelope = {
    data: Prisma.PaymentAllocationCreateManyPartOrderInput | Prisma.PaymentAllocationCreateManyPartOrderInput[];
    skipDuplicates?: boolean;
};
export type PaymentAllocationUpsertWithWhereUniqueWithoutPartOrderInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPartOrderInput>;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartOrderInput>;
};
export type PaymentAllocationUpdateWithWhereUniqueWithoutPartOrderInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPartOrderInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPartOrderInput>;
};
export type PaymentAllocationUpdateManyWithWhereWithoutPartOrderInput = {
    where: Prisma.PaymentAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyWithoutPartOrderInput>;
};
export type PaymentAllocationCreateWithoutPaymentInput = {
    id?: string;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    order?: Prisma.OrderCreateNestedOneWithoutAllocationsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAllocationsInput;
    payable?: Prisma.PayableCreateNestedOneWithoutAllocationsInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionCreateNestedOneWithoutAllocationsInput;
};
export type PaymentAllocationUncheckedCreateWithoutPaymentInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationCreateOrConnectWithoutPaymentInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput>;
};
export type PaymentAllocationCreateManyPaymentInputEnvelope = {
    data: Prisma.PaymentAllocationCreateManyPaymentInput | Prisma.PaymentAllocationCreateManyPaymentInput[];
    skipDuplicates?: boolean;
};
export type PaymentAllocationUpsertWithWhereUniqueWithoutPaymentInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPaymentInput>;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedCreateWithoutPaymentInput>;
};
export type PaymentAllocationUpdateWithWhereUniqueWithoutPaymentInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPaymentInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPaymentInput>;
};
export type PaymentAllocationUpdateManyWithWhereWithoutPaymentInput = {
    where: Prisma.PaymentAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyWithoutPaymentInput>;
};
export type PaymentAllocationCreateWithoutPartPaymentTransactionInput = {
    id?: string;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment: Prisma.PaymentTransactionCreateNestedOneWithoutAllocationsInput;
    order?: Prisma.OrderCreateNestedOneWithoutAllocationsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAllocationsInput;
    payable?: Prisma.PayableCreateNestedOneWithoutAllocationsInput;
};
export type PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PaymentAllocationCreateOrConnectWithoutPartPaymentTransactionInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput>;
};
export type PaymentAllocationCreateManyPartPaymentTransactionInputEnvelope = {
    data: Prisma.PaymentAllocationCreateManyPartPaymentTransactionInput | Prisma.PaymentAllocationCreateManyPartPaymentTransactionInput[];
    skipDuplicates?: boolean;
};
export type PaymentAllocationUpsertWithWhereUniqueWithoutPartPaymentTransactionInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPartPaymentTransactionInput>;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedCreateWithoutPartPaymentTransactionInput>;
};
export type PaymentAllocationUpdateWithWhereUniqueWithoutPartPaymentTransactionInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPartPaymentTransactionInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPartPaymentTransactionInput>;
};
export type PaymentAllocationUpdateManyWithWhereWithoutPartPaymentTransactionInput = {
    where: Prisma.PaymentAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyWithoutPartPaymentTransactionInput>;
};
export type PaymentAllocationCreateWithoutPayableInput = {
    id?: string;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment: Prisma.PaymentTransactionCreateNestedOneWithoutAllocationsInput;
    order?: Prisma.OrderCreateNestedOneWithoutAllocationsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAllocationsInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionCreateNestedOneWithoutAllocationsInput;
};
export type PaymentAllocationUncheckedCreateWithoutPayableInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    partOrderId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationCreateOrConnectWithoutPayableInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPayableInput, Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput>;
};
export type PaymentAllocationCreateManyPayableInputEnvelope = {
    data: Prisma.PaymentAllocationCreateManyPayableInput | Prisma.PaymentAllocationCreateManyPayableInput[];
    skipDuplicates?: boolean;
};
export type PaymentAllocationUpsertWithWhereUniqueWithoutPayableInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPayableInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPayableInput>;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateWithoutPayableInput, Prisma.PaymentAllocationUncheckedCreateWithoutPayableInput>;
};
export type PaymentAllocationUpdateWithWhereUniqueWithoutPayableInput = {
    where: Prisma.PaymentAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateWithoutPayableInput, Prisma.PaymentAllocationUncheckedUpdateWithoutPayableInput>;
};
export type PaymentAllocationUpdateManyWithWhereWithoutPayableInput = {
    where: Prisma.PaymentAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyWithoutPayableInput>;
};
export type PaymentAllocationCreateManyOrderInput = {
    id?: string;
    paymentId: string;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment?: Prisma.PaymentTransactionUpdateOneRequiredWithoutAllocationsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAllocationsNestedInput;
    payable?: Prisma.PayableUpdateOneWithoutAllocationsNestedInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionUpdateOneWithoutAllocationsNestedInput;
};
export type PaymentAllocationUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationUncheckedUpdateManyWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationCreateManyPartOrderInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment?: Prisma.PaymentTransactionUpdateOneRequiredWithoutAllocationsNestedInput;
    order?: Prisma.OrderUpdateOneWithoutAllocationsNestedInput;
    payable?: Prisma.PayableUpdateOneWithoutAllocationsNestedInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionUpdateOneWithoutAllocationsNestedInput;
};
export type PaymentAllocationUncheckedUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationUncheckedUpdateManyWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationCreateManyPaymentInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    order?: Prisma.OrderUpdateOneWithoutAllocationsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAllocationsNestedInput;
    payable?: Prisma.PayableUpdateOneWithoutAllocationsNestedInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionUpdateOneWithoutAllocationsNestedInput;
};
export type PaymentAllocationUncheckedUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationUncheckedUpdateManyWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationCreateManyPartPaymentTransactionInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    partOrderId?: string | null;
    payableId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PaymentAllocationUpdateWithoutPartPaymentTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment?: Prisma.PaymentTransactionUpdateOneRequiredWithoutAllocationsNestedInput;
    order?: Prisma.OrderUpdateOneWithoutAllocationsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAllocationsNestedInput;
    payable?: Prisma.PayableUpdateOneWithoutAllocationsNestedInput;
};
export type PaymentAllocationUncheckedUpdateWithoutPartPaymentTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PaymentAllocationUncheckedUpdateManyWithoutPartPaymentTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payableId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type PaymentAllocationCreateManyPayableInput = {
    id?: string;
    paymentId: string;
    orderId?: string | null;
    partOrderId?: string | null;
    allocatedAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: string | null;
};
export type PaymentAllocationUpdateWithoutPayableInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    payment?: Prisma.PaymentTransactionUpdateOneRequiredWithoutAllocationsNestedInput;
    order?: Prisma.OrderUpdateOneWithoutAllocationsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAllocationsNestedInput;
    partPaymentTransaction?: Prisma.PartPaymentTransactionUpdateOneWithoutAllocationsNestedInput;
};
export type PaymentAllocationUncheckedUpdateWithoutPayableInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationUncheckedUpdateManyWithoutPayableInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allocatedAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    partPaymentTransactionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PaymentAllocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    paymentId?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    payableId?: boolean;
    allocatedAmount?: boolean;
    partPaymentTransactionId?: boolean;
    payment?: boolean | Prisma.PaymentTransactionDefaultArgs<ExtArgs>;
    order?: boolean | Prisma.PaymentAllocation$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.PaymentAllocation$partOrderArgs<ExtArgs>;
    payable?: boolean | Prisma.PaymentAllocation$payableArgs<ExtArgs>;
    partPaymentTransaction?: boolean | Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>;
}, ExtArgs["result"]["paymentAllocation"]>;
export type PaymentAllocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    paymentId?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    payableId?: boolean;
    allocatedAmount?: boolean;
    partPaymentTransactionId?: boolean;
    payment?: boolean | Prisma.PaymentTransactionDefaultArgs<ExtArgs>;
    order?: boolean | Prisma.PaymentAllocation$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.PaymentAllocation$partOrderArgs<ExtArgs>;
    payable?: boolean | Prisma.PaymentAllocation$payableArgs<ExtArgs>;
    partPaymentTransaction?: boolean | Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>;
}, ExtArgs["result"]["paymentAllocation"]>;
export type PaymentAllocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    paymentId?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    payableId?: boolean;
    allocatedAmount?: boolean;
    partPaymentTransactionId?: boolean;
    payment?: boolean | Prisma.PaymentTransactionDefaultArgs<ExtArgs>;
    order?: boolean | Prisma.PaymentAllocation$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.PaymentAllocation$partOrderArgs<ExtArgs>;
    payable?: boolean | Prisma.PaymentAllocation$payableArgs<ExtArgs>;
    partPaymentTransaction?: boolean | Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>;
}, ExtArgs["result"]["paymentAllocation"]>;
export type PaymentAllocationSelectScalar = {
    id?: boolean;
    paymentId?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    payableId?: boolean;
    allocatedAmount?: boolean;
    partPaymentTransactionId?: boolean;
};
export type PaymentAllocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "paymentId" | "orderId" | "partOrderId" | "payableId" | "allocatedAmount" | "partPaymentTransactionId", ExtArgs["result"]["paymentAllocation"]>;
export type PaymentAllocationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    payment?: boolean | Prisma.PaymentTransactionDefaultArgs<ExtArgs>;
    order?: boolean | Prisma.PaymentAllocation$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.PaymentAllocation$partOrderArgs<ExtArgs>;
    payable?: boolean | Prisma.PaymentAllocation$payableArgs<ExtArgs>;
    partPaymentTransaction?: boolean | Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>;
};
export type PaymentAllocationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    payment?: boolean | Prisma.PaymentTransactionDefaultArgs<ExtArgs>;
    order?: boolean | Prisma.PaymentAllocation$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.PaymentAllocation$partOrderArgs<ExtArgs>;
    payable?: boolean | Prisma.PaymentAllocation$payableArgs<ExtArgs>;
    partPaymentTransaction?: boolean | Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>;
};
export type PaymentAllocationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    payment?: boolean | Prisma.PaymentTransactionDefaultArgs<ExtArgs>;
    order?: boolean | Prisma.PaymentAllocation$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.PaymentAllocation$partOrderArgs<ExtArgs>;
    payable?: boolean | Prisma.PaymentAllocation$payableArgs<ExtArgs>;
    partPaymentTransaction?: boolean | Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>;
};
export type $PaymentAllocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PaymentAllocation";
    objects: {
        payment: Prisma.$PaymentTransactionPayload<ExtArgs>;
        order: Prisma.$OrderPayload<ExtArgs> | null;
        partOrder: Prisma.$PartOrderPayload<ExtArgs> | null;
        payable: Prisma.$PayablePayload<ExtArgs> | null;
        partPaymentTransaction: Prisma.$PartPaymentTransactionPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        paymentId: string;
        orderId: string | null;
        partOrderId: string | null;
        payableId: string | null;
        allocatedAmount: runtime.Decimal;
        partPaymentTransactionId: string | null;
    }, ExtArgs["result"]["paymentAllocation"]>;
    composites: {};
};
export type PaymentAllocationGetPayload<S extends boolean | null | undefined | PaymentAllocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload, S>;
export type PaymentAllocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PaymentAllocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaymentAllocationCountAggregateInputType | true;
};
export interface PaymentAllocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PaymentAllocation'];
        meta: {
            name: 'PaymentAllocation';
        };
    };
    findUnique<T extends PaymentAllocationFindUniqueArgs>(args: Prisma.SelectSubset<T, PaymentAllocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PaymentAllocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PaymentAllocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PaymentAllocationFindFirstArgs>(args?: Prisma.SelectSubset<T, PaymentAllocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PaymentAllocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PaymentAllocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PaymentAllocationFindManyArgs>(args?: Prisma.SelectSubset<T, PaymentAllocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PaymentAllocationCreateArgs>(args: Prisma.SelectSubset<T, PaymentAllocationCreateArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PaymentAllocationCreateManyArgs>(args?: Prisma.SelectSubset<T, PaymentAllocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PaymentAllocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PaymentAllocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PaymentAllocationDeleteArgs>(args: Prisma.SelectSubset<T, PaymentAllocationDeleteArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PaymentAllocationUpdateArgs>(args: Prisma.SelectSubset<T, PaymentAllocationUpdateArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PaymentAllocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, PaymentAllocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PaymentAllocationUpdateManyArgs>(args: Prisma.SelectSubset<T, PaymentAllocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PaymentAllocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PaymentAllocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PaymentAllocationUpsertArgs>(args: Prisma.SelectSubset<T, PaymentAllocationUpsertArgs<ExtArgs>>): Prisma.Prisma__PaymentAllocationClient<runtime.Types.Result.GetResult<Prisma.$PaymentAllocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PaymentAllocationCountArgs>(args?: Prisma.Subset<T, PaymentAllocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PaymentAllocationCountAggregateOutputType> : number>;
    aggregate<T extends PaymentAllocationAggregateArgs>(args: Prisma.Subset<T, PaymentAllocationAggregateArgs>): Prisma.PrismaPromise<GetPaymentAllocationAggregateType<T>>;
    groupBy<T extends PaymentAllocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PaymentAllocationGroupByArgs['orderBy'];
    } : {
        orderBy?: PaymentAllocationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PaymentAllocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentAllocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PaymentAllocationFieldRefs;
}
export interface Prisma__PaymentAllocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    payment<T extends Prisma.PaymentTransactionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentTransactionDefaultArgs<ExtArgs>>): Prisma.Prisma__PaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    order<T extends Prisma.PaymentAllocation$orderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentAllocation$orderArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    partOrder<T extends Prisma.PaymentAllocation$partOrderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentAllocation$partOrderArgs<ExtArgs>>): Prisma.Prisma__PartOrderClient<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    payable<T extends Prisma.PaymentAllocation$payableArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentAllocation$payableArgs<ExtArgs>>): Prisma.Prisma__PayableClient<runtime.Types.Result.GetResult<Prisma.$PayablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    partPaymentTransaction<T extends Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentAllocation$partPaymentTransactionArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PaymentAllocationFieldRefs {
    readonly id: Prisma.FieldRef<"PaymentAllocation", 'String'>;
    readonly paymentId: Prisma.FieldRef<"PaymentAllocation", 'String'>;
    readonly orderId: Prisma.FieldRef<"PaymentAllocation", 'String'>;
    readonly partOrderId: Prisma.FieldRef<"PaymentAllocation", 'String'>;
    readonly payableId: Prisma.FieldRef<"PaymentAllocation", 'String'>;
    readonly allocatedAmount: Prisma.FieldRef<"PaymentAllocation", 'Decimal'>;
    readonly partPaymentTransactionId: Prisma.FieldRef<"PaymentAllocation", 'String'>;
}
export type PaymentAllocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    where: Prisma.PaymentAllocationWhereUniqueInput;
};
export type PaymentAllocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    where: Prisma.PaymentAllocationWhereUniqueInput;
};
export type PaymentAllocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PaymentAllocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PaymentAllocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PaymentAllocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentAllocationCreateInput, Prisma.PaymentAllocationUncheckedCreateInput>;
};
export type PaymentAllocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PaymentAllocationCreateManyInput | Prisma.PaymentAllocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PaymentAllocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    data: Prisma.PaymentAllocationCreateManyInput | Prisma.PaymentAllocationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PaymentAllocationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PaymentAllocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateInput, Prisma.PaymentAllocationUncheckedUpdateInput>;
    where: Prisma.PaymentAllocationWhereUniqueInput;
};
export type PaymentAllocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyInput>;
    where?: Prisma.PaymentAllocationWhereInput;
    limit?: number;
};
export type PaymentAllocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentAllocationUpdateManyMutationInput, Prisma.PaymentAllocationUncheckedUpdateManyInput>;
    where?: Prisma.PaymentAllocationWhereInput;
    limit?: number;
    include?: Prisma.PaymentAllocationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PaymentAllocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    where: Prisma.PaymentAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentAllocationCreateInput, Prisma.PaymentAllocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PaymentAllocationUpdateInput, Prisma.PaymentAllocationUncheckedUpdateInput>;
};
export type PaymentAllocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
    where: Prisma.PaymentAllocationWhereUniqueInput;
};
export type PaymentAllocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentAllocationWhereInput;
    limit?: number;
};
export type PaymentAllocation$orderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
};
export type PaymentAllocation$partOrderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartOrderSelect<ExtArgs> | null;
    omit?: Prisma.PartOrderOmit<ExtArgs> | null;
    include?: Prisma.PartOrderInclude<ExtArgs> | null;
    where?: Prisma.PartOrderWhereInput;
};
export type PaymentAllocation$payableArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayableSelect<ExtArgs> | null;
    omit?: Prisma.PayableOmit<ExtArgs> | null;
    include?: Prisma.PayableInclude<ExtArgs> | null;
    where?: Prisma.PayableWhereInput;
};
export type PaymentAllocation$partPaymentTransactionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where?: Prisma.PartPaymentTransactionWhereInput;
};
export type PaymentAllocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentAllocationSelect<ExtArgs> | null;
    omit?: Prisma.PaymentAllocationOmit<ExtArgs> | null;
    include?: Prisma.PaymentAllocationInclude<ExtArgs> | null;
};
