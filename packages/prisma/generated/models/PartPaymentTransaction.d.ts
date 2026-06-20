import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type PartPaymentTransactionModel = runtime.Types.Result.DefaultSelection<Prisma.$PartPaymentTransactionPayload>;
export type AggregatePartPaymentTransaction = {
    _count: PartPaymentTransactionCountAggregateOutputType | null;
    _avg: PartPaymentTransactionAvgAggregateOutputType | null;
    _sum: PartPaymentTransactionSumAggregateOutputType | null;
    _min: PartPaymentTransactionMinAggregateOutputType | null;
    _max: PartPaymentTransactionMaxAggregateOutputType | null;
};
export type PartPaymentTransactionAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type PartPaymentTransactionSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type PartPaymentTransactionMinAggregateOutputType = {
    id: string | null;
    partOrderId: string | null;
    gatewayReference: string | null;
    idempotencyKey: string | null;
    amount: runtime.Decimal | null;
    method: $Enums.PaymentMethod | null;
    status: $Enums.PaymentStatus | null;
    failureReason: string | null;
    webhookReceivedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    paymentProofUrl: string | null;
    verifiedAt: Date | null;
    verifiedById: string | null;
};
export type PartPaymentTransactionMaxAggregateOutputType = {
    id: string | null;
    partOrderId: string | null;
    gatewayReference: string | null;
    idempotencyKey: string | null;
    amount: runtime.Decimal | null;
    method: $Enums.PaymentMethod | null;
    status: $Enums.PaymentStatus | null;
    failureReason: string | null;
    webhookReceivedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    paymentProofUrl: string | null;
    verifiedAt: Date | null;
    verifiedById: string | null;
};
export type PartPaymentTransactionCountAggregateOutputType = {
    id: number;
    partOrderId: number;
    gatewayReference: number;
    idempotencyKey: number;
    amount: number;
    method: number;
    status: number;
    gatewayResponse: number;
    failureReason: number;
    webhookReceivedAt: number;
    createdAt: number;
    updatedAt: number;
    paymentProofUrl: number;
    verifiedAt: number;
    verifiedById: number;
    _all: number;
};
export type PartPaymentTransactionAvgAggregateInputType = {
    amount?: true;
};
export type PartPaymentTransactionSumAggregateInputType = {
    amount?: true;
};
export type PartPaymentTransactionMinAggregateInputType = {
    id?: true;
    partOrderId?: true;
    gatewayReference?: true;
    idempotencyKey?: true;
    amount?: true;
    method?: true;
    status?: true;
    failureReason?: true;
    webhookReceivedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    paymentProofUrl?: true;
    verifiedAt?: true;
    verifiedById?: true;
};
export type PartPaymentTransactionMaxAggregateInputType = {
    id?: true;
    partOrderId?: true;
    gatewayReference?: true;
    idempotencyKey?: true;
    amount?: true;
    method?: true;
    status?: true;
    failureReason?: true;
    webhookReceivedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    paymentProofUrl?: true;
    verifiedAt?: true;
    verifiedById?: true;
};
export type PartPaymentTransactionCountAggregateInputType = {
    id?: true;
    partOrderId?: true;
    gatewayReference?: true;
    idempotencyKey?: true;
    amount?: true;
    method?: true;
    status?: true;
    gatewayResponse?: true;
    failureReason?: true;
    webhookReceivedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    paymentProofUrl?: true;
    verifiedAt?: true;
    verifiedById?: true;
    _all?: true;
};
export type PartPaymentTransactionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartPaymentTransactionWhereInput;
    orderBy?: Prisma.PartPaymentTransactionOrderByWithRelationInput | Prisma.PartPaymentTransactionOrderByWithRelationInput[];
    cursor?: Prisma.PartPaymentTransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PartPaymentTransactionCountAggregateInputType;
    _avg?: PartPaymentTransactionAvgAggregateInputType;
    _sum?: PartPaymentTransactionSumAggregateInputType;
    _min?: PartPaymentTransactionMinAggregateInputType;
    _max?: PartPaymentTransactionMaxAggregateInputType;
};
export type GetPartPaymentTransactionAggregateType<T extends PartPaymentTransactionAggregateArgs> = {
    [P in keyof T & keyof AggregatePartPaymentTransaction]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePartPaymentTransaction[P]> : Prisma.GetScalarType<T[P], AggregatePartPaymentTransaction[P]>;
};
export type PartPaymentTransactionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartPaymentTransactionWhereInput;
    orderBy?: Prisma.PartPaymentTransactionOrderByWithAggregationInput | Prisma.PartPaymentTransactionOrderByWithAggregationInput[];
    by: Prisma.PartPaymentTransactionScalarFieldEnum[] | Prisma.PartPaymentTransactionScalarFieldEnum;
    having?: Prisma.PartPaymentTransactionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PartPaymentTransactionCountAggregateInputType | true;
    _avg?: PartPaymentTransactionAvgAggregateInputType;
    _sum?: PartPaymentTransactionSumAggregateInputType;
    _min?: PartPaymentTransactionMinAggregateInputType;
    _max?: PartPaymentTransactionMaxAggregateInputType;
};
export type PartPaymentTransactionGroupByOutputType = {
    id: string;
    partOrderId: string;
    gatewayReference: string | null;
    idempotencyKey: string | null;
    amount: runtime.Decimal;
    method: $Enums.PaymentMethod;
    status: $Enums.PaymentStatus;
    gatewayResponse: runtime.JsonValue | null;
    failureReason: string | null;
    webhookReceivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    paymentProofUrl: string | null;
    verifiedAt: Date | null;
    verifiedById: string | null;
    _count: PartPaymentTransactionCountAggregateOutputType | null;
    _avg: PartPaymentTransactionAvgAggregateOutputType | null;
    _sum: PartPaymentTransactionSumAggregateOutputType | null;
    _min: PartPaymentTransactionMinAggregateOutputType | null;
    _max: PartPaymentTransactionMaxAggregateOutputType | null;
};
export type GetPartPaymentTransactionGroupByPayload<T extends PartPaymentTransactionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PartPaymentTransactionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PartPaymentTransactionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PartPaymentTransactionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PartPaymentTransactionGroupByOutputType[P]>;
}>>;
export type PartPaymentTransactionWhereInput = {
    AND?: Prisma.PartPaymentTransactionWhereInput | Prisma.PartPaymentTransactionWhereInput[];
    OR?: Prisma.PartPaymentTransactionWhereInput[];
    NOT?: Prisma.PartPaymentTransactionWhereInput | Prisma.PartPaymentTransactionWhereInput[];
    id?: Prisma.StringFilter<"PartPaymentTransaction"> | string;
    partOrderId?: Prisma.StringFilter<"PartPaymentTransaction"> | string;
    gatewayReference?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    amount?: Prisma.DecimalFilter<"PartPaymentTransaction"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFilter<"PartPaymentTransaction"> | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFilter<"PartPaymentTransaction"> | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.JsonNullableFilter<"PartPaymentTransaction">;
    failureReason?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    webhookReceivedAt?: Prisma.DateTimeNullableFilter<"PartPaymentTransaction"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PartPaymentTransaction"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PartPaymentTransaction"> | Date | string;
    paymentProofUrl?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    verifiedAt?: Prisma.DateTimeNullableFilter<"PartPaymentTransaction"> | Date | string | null;
    verifiedById?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderScalarRelationFilter, Prisma.PartOrderWhereInput>;
};
export type PartPaymentTransactionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    gatewayReference?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    gatewayResponse?: Prisma.SortOrderInput | Prisma.SortOrder;
    failureReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    webhookReceivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    paymentProofUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    verifiedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrder?: Prisma.PartOrderOrderByWithRelationInput;
};
export type PartPaymentTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    gatewayReference?: string;
    idempotencyKey?: string;
    AND?: Prisma.PartPaymentTransactionWhereInput | Prisma.PartPaymentTransactionWhereInput[];
    OR?: Prisma.PartPaymentTransactionWhereInput[];
    NOT?: Prisma.PartPaymentTransactionWhereInput | Prisma.PartPaymentTransactionWhereInput[];
    partOrderId?: Prisma.StringFilter<"PartPaymentTransaction"> | string;
    amount?: Prisma.DecimalFilter<"PartPaymentTransaction"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFilter<"PartPaymentTransaction"> | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFilter<"PartPaymentTransaction"> | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.JsonNullableFilter<"PartPaymentTransaction">;
    failureReason?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    webhookReceivedAt?: Prisma.DateTimeNullableFilter<"PartPaymentTransaction"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PartPaymentTransaction"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PartPaymentTransaction"> | Date | string;
    paymentProofUrl?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    verifiedAt?: Prisma.DateTimeNullableFilter<"PartPaymentTransaction"> | Date | string | null;
    verifiedById?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderScalarRelationFilter, Prisma.PartOrderWhereInput>;
}, "id" | "gatewayReference" | "idempotencyKey">;
export type PartPaymentTransactionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    gatewayReference?: Prisma.SortOrderInput | Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    gatewayResponse?: Prisma.SortOrderInput | Prisma.SortOrder;
    failureReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    webhookReceivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    paymentProofUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    verifiedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PartPaymentTransactionCountOrderByAggregateInput;
    _avg?: Prisma.PartPaymentTransactionAvgOrderByAggregateInput;
    _max?: Prisma.PartPaymentTransactionMaxOrderByAggregateInput;
    _min?: Prisma.PartPaymentTransactionMinOrderByAggregateInput;
    _sum?: Prisma.PartPaymentTransactionSumOrderByAggregateInput;
};
export type PartPaymentTransactionScalarWhereWithAggregatesInput = {
    AND?: Prisma.PartPaymentTransactionScalarWhereWithAggregatesInput | Prisma.PartPaymentTransactionScalarWhereWithAggregatesInput[];
    OR?: Prisma.PartPaymentTransactionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PartPaymentTransactionScalarWhereWithAggregatesInput | Prisma.PartPaymentTransactionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PartPaymentTransaction"> | string;
    partOrderId?: Prisma.StringWithAggregatesFilter<"PartPaymentTransaction"> | string;
    gatewayReference?: Prisma.StringNullableWithAggregatesFilter<"PartPaymentTransaction"> | string | null;
    idempotencyKey?: Prisma.StringNullableWithAggregatesFilter<"PartPaymentTransaction"> | string | null;
    amount?: Prisma.DecimalWithAggregatesFilter<"PartPaymentTransaction"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodWithAggregatesFilter<"PartPaymentTransaction"> | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusWithAggregatesFilter<"PartPaymentTransaction"> | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.JsonNullableWithAggregatesFilter<"PartPaymentTransaction">;
    failureReason?: Prisma.StringNullableWithAggregatesFilter<"PartPaymentTransaction"> | string | null;
    webhookReceivedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PartPaymentTransaction"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PartPaymentTransaction"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PartPaymentTransaction"> | Date | string;
    paymentProofUrl?: Prisma.StringNullableWithAggregatesFilter<"PartPaymentTransaction"> | string | null;
    verifiedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PartPaymentTransaction"> | Date | string | null;
    verifiedById?: Prisma.StringNullableWithAggregatesFilter<"PartPaymentTransaction"> | string | null;
};
export type PartPaymentTransactionCreateInput = {
    id?: string;
    gatewayReference?: string | null;
    idempotencyKey?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    status?: $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: string | null;
    webhookReceivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentProofUrl?: string | null;
    verifiedAt?: Date | string | null;
    verifiedById?: string | null;
    partOrder: Prisma.PartOrderCreateNestedOneWithoutTransactionsInput;
};
export type PartPaymentTransactionUncheckedCreateInput = {
    id?: string;
    partOrderId: string;
    gatewayReference?: string | null;
    idempotencyKey?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    status?: $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: string | null;
    webhookReceivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentProofUrl?: string | null;
    verifiedAt?: Date | string | null;
    verifiedById?: string | null;
};
export type PartPaymentTransactionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrder?: Prisma.PartOrderUpdateOneRequiredWithoutTransactionsNestedInput;
};
export type PartPaymentTransactionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PartPaymentTransactionCreateManyInput = {
    id?: string;
    partOrderId: string;
    gatewayReference?: string | null;
    idempotencyKey?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    status?: $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: string | null;
    webhookReceivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentProofUrl?: string | null;
    verifiedAt?: Date | string | null;
    verifiedById?: string | null;
};
export type PartPaymentTransactionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PartPaymentTransactionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PartPaymentTransactionListRelationFilter = {
    every?: Prisma.PartPaymentTransactionWhereInput;
    some?: Prisma.PartPaymentTransactionWhereInput;
    none?: Prisma.PartPaymentTransactionWhereInput;
};
export type PartPaymentTransactionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PartPaymentTransactionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    gatewayReference?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    gatewayResponse?: Prisma.SortOrder;
    failureReason?: Prisma.SortOrder;
    webhookReceivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    paymentProofUrl?: Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
};
export type PartPaymentTransactionAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type PartPaymentTransactionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    gatewayReference?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    failureReason?: Prisma.SortOrder;
    webhookReceivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    paymentProofUrl?: Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
};
export type PartPaymentTransactionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    gatewayReference?: Prisma.SortOrder;
    idempotencyKey?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    failureReason?: Prisma.SortOrder;
    webhookReceivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    paymentProofUrl?: Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
};
export type PartPaymentTransactionSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type PartPaymentTransactionCreateNestedManyWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.PartPaymentTransactionCreateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput> | Prisma.PartPaymentTransactionCreateWithoutPartOrderInput[] | Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput | Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput[];
    createMany?: Prisma.PartPaymentTransactionCreateManyPartOrderInputEnvelope;
    connect?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
};
export type PartPaymentTransactionUncheckedCreateNestedManyWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.PartPaymentTransactionCreateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput> | Prisma.PartPaymentTransactionCreateWithoutPartOrderInput[] | Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput | Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput[];
    createMany?: Prisma.PartPaymentTransactionCreateManyPartOrderInputEnvelope;
    connect?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
};
export type PartPaymentTransactionUpdateManyWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PartPaymentTransactionCreateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput> | Prisma.PartPaymentTransactionCreateWithoutPartOrderInput[] | Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput | Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput[];
    upsert?: Prisma.PartPaymentTransactionUpsertWithWhereUniqueWithoutPartOrderInput | Prisma.PartPaymentTransactionUpsertWithWhereUniqueWithoutPartOrderInput[];
    createMany?: Prisma.PartPaymentTransactionCreateManyPartOrderInputEnvelope;
    set?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    disconnect?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    delete?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    connect?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    update?: Prisma.PartPaymentTransactionUpdateWithWhereUniqueWithoutPartOrderInput | Prisma.PartPaymentTransactionUpdateWithWhereUniqueWithoutPartOrderInput[];
    updateMany?: Prisma.PartPaymentTransactionUpdateManyWithWhereWithoutPartOrderInput | Prisma.PartPaymentTransactionUpdateManyWithWhereWithoutPartOrderInput[];
    deleteMany?: Prisma.PartPaymentTransactionScalarWhereInput | Prisma.PartPaymentTransactionScalarWhereInput[];
};
export type PartPaymentTransactionUncheckedUpdateManyWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.PartPaymentTransactionCreateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput> | Prisma.PartPaymentTransactionCreateWithoutPartOrderInput[] | Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput | Prisma.PartPaymentTransactionCreateOrConnectWithoutPartOrderInput[];
    upsert?: Prisma.PartPaymentTransactionUpsertWithWhereUniqueWithoutPartOrderInput | Prisma.PartPaymentTransactionUpsertWithWhereUniqueWithoutPartOrderInput[];
    createMany?: Prisma.PartPaymentTransactionCreateManyPartOrderInputEnvelope;
    set?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    disconnect?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    delete?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    connect?: Prisma.PartPaymentTransactionWhereUniqueInput | Prisma.PartPaymentTransactionWhereUniqueInput[];
    update?: Prisma.PartPaymentTransactionUpdateWithWhereUniqueWithoutPartOrderInput | Prisma.PartPaymentTransactionUpdateWithWhereUniqueWithoutPartOrderInput[];
    updateMany?: Prisma.PartPaymentTransactionUpdateManyWithWhereWithoutPartOrderInput | Prisma.PartPaymentTransactionUpdateManyWithWhereWithoutPartOrderInput[];
    deleteMany?: Prisma.PartPaymentTransactionScalarWhereInput | Prisma.PartPaymentTransactionScalarWhereInput[];
};
export type PartPaymentTransactionCreateWithoutPartOrderInput = {
    id?: string;
    gatewayReference?: string | null;
    idempotencyKey?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    status?: $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: string | null;
    webhookReceivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentProofUrl?: string | null;
    verifiedAt?: Date | string | null;
    verifiedById?: string | null;
};
export type PartPaymentTransactionUncheckedCreateWithoutPartOrderInput = {
    id?: string;
    gatewayReference?: string | null;
    idempotencyKey?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    status?: $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: string | null;
    webhookReceivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentProofUrl?: string | null;
    verifiedAt?: Date | string | null;
    verifiedById?: string | null;
};
export type PartPaymentTransactionCreateOrConnectWithoutPartOrderInput = {
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartPaymentTransactionCreateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput>;
};
export type PartPaymentTransactionCreateManyPartOrderInputEnvelope = {
    data: Prisma.PartPaymentTransactionCreateManyPartOrderInput | Prisma.PartPaymentTransactionCreateManyPartOrderInput[];
    skipDuplicates?: boolean;
};
export type PartPaymentTransactionUpsertWithWhereUniqueWithoutPartOrderInput = {
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
    update: Prisma.XOR<Prisma.PartPaymentTransactionUpdateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedUpdateWithoutPartOrderInput>;
    create: Prisma.XOR<Prisma.PartPaymentTransactionCreateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedCreateWithoutPartOrderInput>;
};
export type PartPaymentTransactionUpdateWithWhereUniqueWithoutPartOrderInput = {
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
    data: Prisma.XOR<Prisma.PartPaymentTransactionUpdateWithoutPartOrderInput, Prisma.PartPaymentTransactionUncheckedUpdateWithoutPartOrderInput>;
};
export type PartPaymentTransactionUpdateManyWithWhereWithoutPartOrderInput = {
    where: Prisma.PartPaymentTransactionScalarWhereInput;
    data: Prisma.XOR<Prisma.PartPaymentTransactionUpdateManyMutationInput, Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutPartOrderInput>;
};
export type PartPaymentTransactionScalarWhereInput = {
    AND?: Prisma.PartPaymentTransactionScalarWhereInput | Prisma.PartPaymentTransactionScalarWhereInput[];
    OR?: Prisma.PartPaymentTransactionScalarWhereInput[];
    NOT?: Prisma.PartPaymentTransactionScalarWhereInput | Prisma.PartPaymentTransactionScalarWhereInput[];
    id?: Prisma.StringFilter<"PartPaymentTransaction"> | string;
    partOrderId?: Prisma.StringFilter<"PartPaymentTransaction"> | string;
    gatewayReference?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    idempotencyKey?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    amount?: Prisma.DecimalFilter<"PartPaymentTransaction"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFilter<"PartPaymentTransaction"> | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFilter<"PartPaymentTransaction"> | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.JsonNullableFilter<"PartPaymentTransaction">;
    failureReason?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    webhookReceivedAt?: Prisma.DateTimeNullableFilter<"PartPaymentTransaction"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"PartPaymentTransaction"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PartPaymentTransaction"> | Date | string;
    paymentProofUrl?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
    verifiedAt?: Prisma.DateTimeNullableFilter<"PartPaymentTransaction"> | Date | string | null;
    verifiedById?: Prisma.StringNullableFilter<"PartPaymentTransaction"> | string | null;
};
export type PartPaymentTransactionCreateManyPartOrderInput = {
    id?: string;
    gatewayReference?: string | null;
    idempotencyKey?: string | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    method: $Enums.PaymentMethod;
    status?: $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: string | null;
    webhookReceivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentProofUrl?: string | null;
    verifiedAt?: Date | string | null;
    verifiedById?: string | null;
};
export type PartPaymentTransactionUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PartPaymentTransactionUncheckedUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PartPaymentTransactionUncheckedUpdateManyWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    gatewayReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    idempotencyKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    method?: Prisma.EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod;
    status?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    gatewayResponse?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    failureReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    webhookReceivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    paymentProofUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    verifiedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PartPaymentTransactionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partOrderId?: boolean;
    gatewayReference?: boolean;
    idempotencyKey?: boolean;
    amount?: boolean;
    method?: boolean;
    status?: boolean;
    gatewayResponse?: boolean;
    failureReason?: boolean;
    webhookReceivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    paymentProofUrl?: boolean;
    verifiedAt?: boolean;
    verifiedById?: boolean;
    partOrder?: boolean | Prisma.PartOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["partPaymentTransaction"]>;
export type PartPaymentTransactionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partOrderId?: boolean;
    gatewayReference?: boolean;
    idempotencyKey?: boolean;
    amount?: boolean;
    method?: boolean;
    status?: boolean;
    gatewayResponse?: boolean;
    failureReason?: boolean;
    webhookReceivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    paymentProofUrl?: boolean;
    verifiedAt?: boolean;
    verifiedById?: boolean;
    partOrder?: boolean | Prisma.PartOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["partPaymentTransaction"]>;
export type PartPaymentTransactionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    partOrderId?: boolean;
    gatewayReference?: boolean;
    idempotencyKey?: boolean;
    amount?: boolean;
    method?: boolean;
    status?: boolean;
    gatewayResponse?: boolean;
    failureReason?: boolean;
    webhookReceivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    paymentProofUrl?: boolean;
    verifiedAt?: boolean;
    verifiedById?: boolean;
    partOrder?: boolean | Prisma.PartOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["partPaymentTransaction"]>;
export type PartPaymentTransactionSelectScalar = {
    id?: boolean;
    partOrderId?: boolean;
    gatewayReference?: boolean;
    idempotencyKey?: boolean;
    amount?: boolean;
    method?: boolean;
    status?: boolean;
    gatewayResponse?: boolean;
    failureReason?: boolean;
    webhookReceivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    paymentProofUrl?: boolean;
    verifiedAt?: boolean;
    verifiedById?: boolean;
};
export type PartPaymentTransactionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "partOrderId" | "gatewayReference" | "idempotencyKey" | "amount" | "method" | "status" | "gatewayResponse" | "failureReason" | "webhookReceivedAt" | "createdAt" | "updatedAt" | "paymentProofUrl" | "verifiedAt" | "verifiedById", ExtArgs["result"]["partPaymentTransaction"]>;
export type PartPaymentTransactionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    partOrder?: boolean | Prisma.PartOrderDefaultArgs<ExtArgs>;
};
export type PartPaymentTransactionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    partOrder?: boolean | Prisma.PartOrderDefaultArgs<ExtArgs>;
};
export type PartPaymentTransactionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    partOrder?: boolean | Prisma.PartOrderDefaultArgs<ExtArgs>;
};
export type $PartPaymentTransactionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PartPaymentTransaction";
    objects: {
        partOrder: Prisma.$PartOrderPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        partOrderId: string;
        gatewayReference: string | null;
        idempotencyKey: string | null;
        amount: runtime.Decimal;
        method: $Enums.PaymentMethod;
        status: $Enums.PaymentStatus;
        gatewayResponse: runtime.JsonValue | null;
        failureReason: string | null;
        webhookReceivedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        paymentProofUrl: string | null;
        verifiedAt: Date | null;
        verifiedById: string | null;
    }, ExtArgs["result"]["partPaymentTransaction"]>;
    composites: {};
};
export type PartPaymentTransactionGetPayload<S extends boolean | null | undefined | PartPaymentTransactionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload, S>;
export type PartPaymentTransactionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PartPaymentTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PartPaymentTransactionCountAggregateInputType | true;
};
export interface PartPaymentTransactionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PartPaymentTransaction'];
        meta: {
            name: 'PartPaymentTransaction';
        };
    };
    findUnique<T extends PartPaymentTransactionFindUniqueArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PartPaymentTransactionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PartPaymentTransactionFindFirstArgs>(args?: Prisma.SelectSubset<T, PartPaymentTransactionFindFirstArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PartPaymentTransactionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PartPaymentTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PartPaymentTransactionFindManyArgs>(args?: Prisma.SelectSubset<T, PartPaymentTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PartPaymentTransactionCreateArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionCreateArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PartPaymentTransactionCreateManyArgs>(args?: Prisma.SelectSubset<T, PartPaymentTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PartPaymentTransactionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PartPaymentTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PartPaymentTransactionDeleteArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionDeleteArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PartPaymentTransactionUpdateArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionUpdateArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PartPaymentTransactionDeleteManyArgs>(args?: Prisma.SelectSubset<T, PartPaymentTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PartPaymentTransactionUpdateManyArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PartPaymentTransactionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PartPaymentTransactionUpsertArgs>(args: Prisma.SelectSubset<T, PartPaymentTransactionUpsertArgs<ExtArgs>>): Prisma.Prisma__PartPaymentTransactionClient<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PartPaymentTransactionCountArgs>(args?: Prisma.Subset<T, PartPaymentTransactionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PartPaymentTransactionCountAggregateOutputType> : number>;
    aggregate<T extends PartPaymentTransactionAggregateArgs>(args: Prisma.Subset<T, PartPaymentTransactionAggregateArgs>): Prisma.PrismaPromise<GetPartPaymentTransactionAggregateType<T>>;
    groupBy<T extends PartPaymentTransactionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PartPaymentTransactionGroupByArgs['orderBy'];
    } : {
        orderBy?: PartPaymentTransactionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PartPaymentTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartPaymentTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PartPaymentTransactionFieldRefs;
}
export interface Prisma__PartPaymentTransactionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    partOrder<T extends Prisma.PartOrderDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PartOrderDefaultArgs<ExtArgs>>): Prisma.Prisma__PartOrderClient<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PartPaymentTransactionFieldRefs {
    readonly id: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
    readonly partOrderId: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
    readonly gatewayReference: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
    readonly idempotencyKey: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
    readonly amount: Prisma.FieldRef<"PartPaymentTransaction", 'Decimal'>;
    readonly method: Prisma.FieldRef<"PartPaymentTransaction", 'PaymentMethod'>;
    readonly status: Prisma.FieldRef<"PartPaymentTransaction", 'PaymentStatus'>;
    readonly gatewayResponse: Prisma.FieldRef<"PartPaymentTransaction", 'Json'>;
    readonly failureReason: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
    readonly webhookReceivedAt: Prisma.FieldRef<"PartPaymentTransaction", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"PartPaymentTransaction", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PartPaymentTransaction", 'DateTime'>;
    readonly paymentProofUrl: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
    readonly verifiedAt: Prisma.FieldRef<"PartPaymentTransaction", 'DateTime'>;
    readonly verifiedById: Prisma.FieldRef<"PartPaymentTransaction", 'String'>;
}
export type PartPaymentTransactionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
};
export type PartPaymentTransactionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
};
export type PartPaymentTransactionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where?: Prisma.PartPaymentTransactionWhereInput;
    orderBy?: Prisma.PartPaymentTransactionOrderByWithRelationInput | Prisma.PartPaymentTransactionOrderByWithRelationInput[];
    cursor?: Prisma.PartPaymentTransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartPaymentTransactionScalarFieldEnum | Prisma.PartPaymentTransactionScalarFieldEnum[];
};
export type PartPaymentTransactionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where?: Prisma.PartPaymentTransactionWhereInput;
    orderBy?: Prisma.PartPaymentTransactionOrderByWithRelationInput | Prisma.PartPaymentTransactionOrderByWithRelationInput[];
    cursor?: Prisma.PartPaymentTransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartPaymentTransactionScalarFieldEnum | Prisma.PartPaymentTransactionScalarFieldEnum[];
};
export type PartPaymentTransactionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where?: Prisma.PartPaymentTransactionWhereInput;
    orderBy?: Prisma.PartPaymentTransactionOrderByWithRelationInput | Prisma.PartPaymentTransactionOrderByWithRelationInput[];
    cursor?: Prisma.PartPaymentTransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartPaymentTransactionScalarFieldEnum | Prisma.PartPaymentTransactionScalarFieldEnum[];
};
export type PartPaymentTransactionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartPaymentTransactionCreateInput, Prisma.PartPaymentTransactionUncheckedCreateInput>;
};
export type PartPaymentTransactionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PartPaymentTransactionCreateManyInput | Prisma.PartPaymentTransactionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PartPaymentTransactionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    data: Prisma.PartPaymentTransactionCreateManyInput | Prisma.PartPaymentTransactionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PartPaymentTransactionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PartPaymentTransactionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartPaymentTransactionUpdateInput, Prisma.PartPaymentTransactionUncheckedUpdateInput>;
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
};
export type PartPaymentTransactionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PartPaymentTransactionUpdateManyMutationInput, Prisma.PartPaymentTransactionUncheckedUpdateManyInput>;
    where?: Prisma.PartPaymentTransactionWhereInput;
    limit?: number;
};
export type PartPaymentTransactionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PartPaymentTransactionUpdateManyMutationInput, Prisma.PartPaymentTransactionUncheckedUpdateManyInput>;
    where?: Prisma.PartPaymentTransactionWhereInput;
    limit?: number;
    include?: Prisma.PartPaymentTransactionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PartPaymentTransactionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PartPaymentTransactionCreateInput, Prisma.PartPaymentTransactionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PartPaymentTransactionUpdateInput, Prisma.PartPaymentTransactionUncheckedUpdateInput>;
};
export type PartPaymentTransactionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
    where: Prisma.PartPaymentTransactionWhereUniqueInput;
};
export type PartPaymentTransactionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartPaymentTransactionWhereInput;
    limit?: number;
};
export type PartPaymentTransactionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartPaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PartPaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PartPaymentTransactionInclude<ExtArgs> | null;
};
