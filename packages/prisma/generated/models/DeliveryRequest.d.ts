import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type DeliveryRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$DeliveryRequestPayload>;
export type AggregateDeliveryRequest = {
    _count: DeliveryRequestCountAggregateOutputType | null;
    _min: DeliveryRequestMinAggregateOutputType | null;
    _max: DeliveryRequestMaxAggregateOutputType | null;
};
export type DeliveryRequestMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    partOrderId: string | null;
    deliveryAddress: string | null;
    preferredTimeWindow: string | null;
    contactNumber: string | null;
    status: $Enums.DeliveryStatus | null;
    approvedAt: Date | null;
    deliveredAt: Date | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DeliveryRequestMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    partOrderId: string | null;
    deliveryAddress: string | null;
    preferredTimeWindow: string | null;
    contactNumber: string | null;
    status: $Enums.DeliveryStatus | null;
    approvedAt: Date | null;
    deliveredAt: Date | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DeliveryRequestCountAggregateOutputType = {
    id: number;
    orderId: number;
    partOrderId: number;
    deliveryAddress: number;
    preferredTimeWindow: number;
    contactNumber: number;
    status: number;
    approvedAt: number;
    deliveredAt: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DeliveryRequestMinAggregateInputType = {
    id?: true;
    orderId?: true;
    partOrderId?: true;
    deliveryAddress?: true;
    preferredTimeWindow?: true;
    contactNumber?: true;
    status?: true;
    approvedAt?: true;
    deliveredAt?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DeliveryRequestMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    partOrderId?: true;
    deliveryAddress?: true;
    preferredTimeWindow?: true;
    contactNumber?: true;
    status?: true;
    approvedAt?: true;
    deliveredAt?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DeliveryRequestCountAggregateInputType = {
    id?: true;
    orderId?: true;
    partOrderId?: true;
    deliveryAddress?: true;
    preferredTimeWindow?: true;
    contactNumber?: true;
    status?: true;
    approvedAt?: true;
    deliveredAt?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DeliveryRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryRequestWhereInput;
    orderBy?: Prisma.DeliveryRequestOrderByWithRelationInput | Prisma.DeliveryRequestOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DeliveryRequestCountAggregateInputType;
    _min?: DeliveryRequestMinAggregateInputType;
    _max?: DeliveryRequestMaxAggregateInputType;
};
export type GetDeliveryRequestAggregateType<T extends DeliveryRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateDeliveryRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDeliveryRequest[P]> : Prisma.GetScalarType<T[P], AggregateDeliveryRequest[P]>;
};
export type DeliveryRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryRequestWhereInput;
    orderBy?: Prisma.DeliveryRequestOrderByWithAggregationInput | Prisma.DeliveryRequestOrderByWithAggregationInput[];
    by: Prisma.DeliveryRequestScalarFieldEnum[] | Prisma.DeliveryRequestScalarFieldEnum;
    having?: Prisma.DeliveryRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DeliveryRequestCountAggregateInputType | true;
    _min?: DeliveryRequestMinAggregateInputType;
    _max?: DeliveryRequestMaxAggregateInputType;
};
export type DeliveryRequestGroupByOutputType = {
    id: string;
    orderId: string | null;
    partOrderId: string | null;
    deliveryAddress: string;
    preferredTimeWindow: string | null;
    contactNumber: string;
    status: $Enums.DeliveryStatus;
    approvedAt: Date | null;
    deliveredAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: DeliveryRequestCountAggregateOutputType | null;
    _min: DeliveryRequestMinAggregateOutputType | null;
    _max: DeliveryRequestMaxAggregateOutputType | null;
};
export type GetDeliveryRequestGroupByPayload<T extends DeliveryRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DeliveryRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DeliveryRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DeliveryRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DeliveryRequestGroupByOutputType[P]>;
}>>;
export type DeliveryRequestWhereInput = {
    AND?: Prisma.DeliveryRequestWhereInput | Prisma.DeliveryRequestWhereInput[];
    OR?: Prisma.DeliveryRequestWhereInput[];
    NOT?: Prisma.DeliveryRequestWhereInput | Prisma.DeliveryRequestWhereInput[];
    id?: Prisma.StringFilter<"DeliveryRequest"> | string;
    orderId?: Prisma.StringNullableFilter<"DeliveryRequest"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"DeliveryRequest"> | string | null;
    deliveryAddress?: Prisma.StringFilter<"DeliveryRequest"> | string;
    preferredTimeWindow?: Prisma.StringNullableFilter<"DeliveryRequest"> | string | null;
    contactNumber?: Prisma.StringFilter<"DeliveryRequest"> | string;
    status?: Prisma.EnumDeliveryStatusFilter<"DeliveryRequest"> | $Enums.DeliveryStatus;
    approvedAt?: Prisma.DateTimeNullableFilter<"DeliveryRequest"> | Date | string | null;
    deliveredAt?: Prisma.DateTimeNullableFilter<"DeliveryRequest"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"DeliveryRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DeliveryRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DeliveryRequest"> | Date | string;
    order?: Prisma.XOR<Prisma.OrderNullableScalarRelationFilter, Prisma.OrderWhereInput> | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderNullableScalarRelationFilter, Prisma.PartOrderWhereInput> | null;
};
export type DeliveryRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    preferredTimeWindow?: Prisma.SortOrderInput | Prisma.SortOrder;
    contactNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    order?: Prisma.OrderOrderByWithRelationInput;
    partOrder?: Prisma.PartOrderOrderByWithRelationInput;
};
export type DeliveryRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orderId?: string;
    partOrderId?: string;
    AND?: Prisma.DeliveryRequestWhereInput | Prisma.DeliveryRequestWhereInput[];
    OR?: Prisma.DeliveryRequestWhereInput[];
    NOT?: Prisma.DeliveryRequestWhereInput | Prisma.DeliveryRequestWhereInput[];
    deliveryAddress?: Prisma.StringFilter<"DeliveryRequest"> | string;
    preferredTimeWindow?: Prisma.StringNullableFilter<"DeliveryRequest"> | string | null;
    contactNumber?: Prisma.StringFilter<"DeliveryRequest"> | string;
    status?: Prisma.EnumDeliveryStatusFilter<"DeliveryRequest"> | $Enums.DeliveryStatus;
    approvedAt?: Prisma.DateTimeNullableFilter<"DeliveryRequest"> | Date | string | null;
    deliveredAt?: Prisma.DateTimeNullableFilter<"DeliveryRequest"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"DeliveryRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DeliveryRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DeliveryRequest"> | Date | string;
    order?: Prisma.XOR<Prisma.OrderNullableScalarRelationFilter, Prisma.OrderWhereInput> | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderNullableScalarRelationFilter, Prisma.PartOrderWhereInput> | null;
}, "id" | "orderId" | "partOrderId">;
export type DeliveryRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    preferredTimeWindow?: Prisma.SortOrderInput | Prisma.SortOrder;
    contactNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DeliveryRequestCountOrderByAggregateInput;
    _max?: Prisma.DeliveryRequestMaxOrderByAggregateInput;
    _min?: Prisma.DeliveryRequestMinOrderByAggregateInput;
};
export type DeliveryRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.DeliveryRequestScalarWhereWithAggregatesInput | Prisma.DeliveryRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.DeliveryRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DeliveryRequestScalarWhereWithAggregatesInput | Prisma.DeliveryRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DeliveryRequest"> | string;
    orderId?: Prisma.StringNullableWithAggregatesFilter<"DeliveryRequest"> | string | null;
    partOrderId?: Prisma.StringNullableWithAggregatesFilter<"DeliveryRequest"> | string | null;
    deliveryAddress?: Prisma.StringWithAggregatesFilter<"DeliveryRequest"> | string;
    preferredTimeWindow?: Prisma.StringNullableWithAggregatesFilter<"DeliveryRequest"> | string | null;
    contactNumber?: Prisma.StringWithAggregatesFilter<"DeliveryRequest"> | string;
    status?: Prisma.EnumDeliveryStatusWithAggregatesFilter<"DeliveryRequest"> | $Enums.DeliveryStatus;
    approvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"DeliveryRequest"> | Date | string | null;
    deliveredAt?: Prisma.DateTimeNullableWithAggregatesFilter<"DeliveryRequest"> | Date | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"DeliveryRequest"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DeliveryRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DeliveryRequest"> | Date | string;
};
export type DeliveryRequestCreateInput = {
    id?: string;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutDeliveryInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutDeliveryInput;
};
export type DeliveryRequestUncheckedCreateInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeliveryRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    order?: Prisma.OrderUpdateOneWithoutDeliveryNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutDeliveryNestedInput;
};
export type DeliveryRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeliveryRequestCreateManyInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeliveryRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeliveryRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeliveryRequestNullableScalarRelationFilter = {
    is?: Prisma.DeliveryRequestWhereInput | null;
    isNot?: Prisma.DeliveryRequestWhereInput | null;
};
export type DeliveryRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    preferredTimeWindow?: Prisma.SortOrder;
    contactNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approvedAt?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeliveryRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    preferredTimeWindow?: Prisma.SortOrder;
    contactNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approvedAt?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeliveryRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    preferredTimeWindow?: Prisma.SortOrder;
    contactNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approvedAt?: Prisma.SortOrder;
    deliveredAt?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeliveryRequestCreateNestedOneWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutOrderInput;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestUncheckedCreateNestedOneWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutOrderInput;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestUpdateOneWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutOrderInput;
    upsert?: Prisma.DeliveryRequestUpsertWithoutOrderInput;
    disconnect?: Prisma.DeliveryRequestWhereInput | boolean;
    delete?: Prisma.DeliveryRequestWhereInput | boolean;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DeliveryRequestUpdateToOneWithWhereWithoutOrderInput, Prisma.DeliveryRequestUpdateWithoutOrderInput>, Prisma.DeliveryRequestUncheckedUpdateWithoutOrderInput>;
};
export type DeliveryRequestUncheckedUpdateOneWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutOrderInput;
    upsert?: Prisma.DeliveryRequestUpsertWithoutOrderInput;
    disconnect?: Prisma.DeliveryRequestWhereInput | boolean;
    delete?: Prisma.DeliveryRequestWhereInput | boolean;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DeliveryRequestUpdateToOneWithWhereWithoutOrderInput, Prisma.DeliveryRequestUpdateWithoutOrderInput>, Prisma.DeliveryRequestUncheckedUpdateWithoutOrderInput>;
};
export type DeliveryRequestCreateNestedOneWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutPartOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutPartOrderInput;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestUncheckedCreateNestedOneWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutPartOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutPartOrderInput;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestUpdateOneWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutPartOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutPartOrderInput;
    upsert?: Prisma.DeliveryRequestUpsertWithoutPartOrderInput;
    disconnect?: Prisma.DeliveryRequestWhereInput | boolean;
    delete?: Prisma.DeliveryRequestWhereInput | boolean;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DeliveryRequestUpdateToOneWithWhereWithoutPartOrderInput, Prisma.DeliveryRequestUpdateWithoutPartOrderInput>, Prisma.DeliveryRequestUncheckedUpdateWithoutPartOrderInput>;
};
export type DeliveryRequestUncheckedUpdateOneWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutPartOrderInput>;
    connectOrCreate?: Prisma.DeliveryRequestCreateOrConnectWithoutPartOrderInput;
    upsert?: Prisma.DeliveryRequestUpsertWithoutPartOrderInput;
    disconnect?: Prisma.DeliveryRequestWhereInput | boolean;
    delete?: Prisma.DeliveryRequestWhereInput | boolean;
    connect?: Prisma.DeliveryRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DeliveryRequestUpdateToOneWithWhereWithoutPartOrderInput, Prisma.DeliveryRequestUpdateWithoutPartOrderInput>, Prisma.DeliveryRequestUncheckedUpdateWithoutPartOrderInput>;
};
export type EnumDeliveryStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeliveryStatus;
};
export type DeliveryRequestCreateWithoutOrderInput = {
    id?: string;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutDeliveryInput;
};
export type DeliveryRequestUncheckedCreateWithoutOrderInput = {
    id?: string;
    partOrderId?: string | null;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeliveryRequestCreateOrConnectWithoutOrderInput = {
    where: Prisma.DeliveryRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutOrderInput>;
};
export type DeliveryRequestUpsertWithoutOrderInput = {
    update: Prisma.XOR<Prisma.DeliveryRequestUpdateWithoutOrderInput, Prisma.DeliveryRequestUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutOrderInput>;
    where?: Prisma.DeliveryRequestWhereInput;
};
export type DeliveryRequestUpdateToOneWithWhereWithoutOrderInput = {
    where?: Prisma.DeliveryRequestWhereInput;
    data: Prisma.XOR<Prisma.DeliveryRequestUpdateWithoutOrderInput, Prisma.DeliveryRequestUncheckedUpdateWithoutOrderInput>;
};
export type DeliveryRequestUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partOrder?: Prisma.PartOrderUpdateOneWithoutDeliveryNestedInput;
};
export type DeliveryRequestUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeliveryRequestCreateWithoutPartOrderInput = {
    id?: string;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutDeliveryInput;
};
export type DeliveryRequestUncheckedCreateWithoutPartOrderInput = {
    id?: string;
    orderId?: string | null;
    deliveryAddress: string;
    preferredTimeWindow?: string | null;
    contactNumber: string;
    status?: $Enums.DeliveryStatus;
    approvedAt?: Date | string | null;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeliveryRequestCreateOrConnectWithoutPartOrderInput = {
    where: Prisma.DeliveryRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutPartOrderInput>;
};
export type DeliveryRequestUpsertWithoutPartOrderInput = {
    update: Prisma.XOR<Prisma.DeliveryRequestUpdateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedUpdateWithoutPartOrderInput>;
    create: Prisma.XOR<Prisma.DeliveryRequestCreateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedCreateWithoutPartOrderInput>;
    where?: Prisma.DeliveryRequestWhereInput;
};
export type DeliveryRequestUpdateToOneWithWhereWithoutPartOrderInput = {
    where?: Prisma.DeliveryRequestWhereInput;
    data: Prisma.XOR<Prisma.DeliveryRequestUpdateWithoutPartOrderInput, Prisma.DeliveryRequestUncheckedUpdateWithoutPartOrderInput>;
};
export type DeliveryRequestUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    order?: Prisma.OrderUpdateOneWithoutDeliveryNestedInput;
};
export type DeliveryRequestUncheckedUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deliveryAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTimeWindow?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumDeliveryStatusFieldUpdateOperationsInput | $Enums.DeliveryStatus;
    approvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deliveredAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeliveryRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    deliveryAddress?: boolean;
    preferredTimeWindow?: boolean;
    contactNumber?: boolean;
    status?: boolean;
    approvedAt?: boolean;
    deliveredAt?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    order?: boolean | Prisma.DeliveryRequest$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.DeliveryRequest$partOrderArgs<ExtArgs>;
}, ExtArgs["result"]["deliveryRequest"]>;
export type DeliveryRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    deliveryAddress?: boolean;
    preferredTimeWindow?: boolean;
    contactNumber?: boolean;
    status?: boolean;
    approvedAt?: boolean;
    deliveredAt?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    order?: boolean | Prisma.DeliveryRequest$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.DeliveryRequest$partOrderArgs<ExtArgs>;
}, ExtArgs["result"]["deliveryRequest"]>;
export type DeliveryRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    deliveryAddress?: boolean;
    preferredTimeWindow?: boolean;
    contactNumber?: boolean;
    status?: boolean;
    approvedAt?: boolean;
    deliveredAt?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    order?: boolean | Prisma.DeliveryRequest$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.DeliveryRequest$partOrderArgs<ExtArgs>;
}, ExtArgs["result"]["deliveryRequest"]>;
export type DeliveryRequestSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    deliveryAddress?: boolean;
    preferredTimeWindow?: boolean;
    contactNumber?: boolean;
    status?: boolean;
    approvedAt?: boolean;
    deliveredAt?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DeliveryRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderId" | "partOrderId" | "deliveryAddress" | "preferredTimeWindow" | "contactNumber" | "status" | "approvedAt" | "deliveredAt" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["deliveryRequest"]>;
export type DeliveryRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.DeliveryRequest$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.DeliveryRequest$partOrderArgs<ExtArgs>;
};
export type DeliveryRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.DeliveryRequest$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.DeliveryRequest$partOrderArgs<ExtArgs>;
};
export type DeliveryRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.DeliveryRequest$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.DeliveryRequest$partOrderArgs<ExtArgs>;
};
export type $DeliveryRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DeliveryRequest";
    objects: {
        order: Prisma.$OrderPayload<ExtArgs> | null;
        partOrder: Prisma.$PartOrderPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orderId: string | null;
        partOrderId: string | null;
        deliveryAddress: string;
        preferredTimeWindow: string | null;
        contactNumber: string;
        status: $Enums.DeliveryStatus;
        approvedAt: Date | null;
        deliveredAt: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["deliveryRequest"]>;
    composites: {};
};
export type DeliveryRequestGetPayload<S extends boolean | null | undefined | DeliveryRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload, S>;
export type DeliveryRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DeliveryRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DeliveryRequestCountAggregateInputType | true;
};
export interface DeliveryRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DeliveryRequest'];
        meta: {
            name: 'DeliveryRequest';
        };
    };
    findUnique<T extends DeliveryRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, DeliveryRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DeliveryRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DeliveryRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DeliveryRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, DeliveryRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DeliveryRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DeliveryRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DeliveryRequestFindManyArgs>(args?: Prisma.SelectSubset<T, DeliveryRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DeliveryRequestCreateArgs>(args: Prisma.SelectSubset<T, DeliveryRequestCreateArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DeliveryRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, DeliveryRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DeliveryRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DeliveryRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DeliveryRequestDeleteArgs>(args: Prisma.SelectSubset<T, DeliveryRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DeliveryRequestUpdateArgs>(args: Prisma.SelectSubset<T, DeliveryRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DeliveryRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, DeliveryRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DeliveryRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, DeliveryRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DeliveryRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DeliveryRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DeliveryRequestUpsertArgs>(args: Prisma.SelectSubset<T, DeliveryRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__DeliveryRequestClient<runtime.Types.Result.GetResult<Prisma.$DeliveryRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DeliveryRequestCountArgs>(args?: Prisma.Subset<T, DeliveryRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DeliveryRequestCountAggregateOutputType> : number>;
    aggregate<T extends DeliveryRequestAggregateArgs>(args: Prisma.Subset<T, DeliveryRequestAggregateArgs>): Prisma.PrismaPromise<GetDeliveryRequestAggregateType<T>>;
    groupBy<T extends DeliveryRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DeliveryRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: DeliveryRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DeliveryRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeliveryRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DeliveryRequestFieldRefs;
}
export interface Prisma__DeliveryRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    order<T extends Prisma.DeliveryRequest$orderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DeliveryRequest$orderArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    partOrder<T extends Prisma.DeliveryRequest$partOrderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DeliveryRequest$partOrderArgs<ExtArgs>>): Prisma.Prisma__PartOrderClient<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DeliveryRequestFieldRefs {
    readonly id: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly orderId: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly partOrderId: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly deliveryAddress: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly preferredTimeWindow: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly contactNumber: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly status: Prisma.FieldRef<"DeliveryRequest", 'DeliveryStatus'>;
    readonly approvedAt: Prisma.FieldRef<"DeliveryRequest", 'DateTime'>;
    readonly deliveredAt: Prisma.FieldRef<"DeliveryRequest", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"DeliveryRequest", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DeliveryRequest", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DeliveryRequest", 'DateTime'>;
}
export type DeliveryRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where?: Prisma.DeliveryRequestWhereInput;
    orderBy?: Prisma.DeliveryRequestOrderByWithRelationInput | Prisma.DeliveryRequestOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryRequestScalarFieldEnum | Prisma.DeliveryRequestScalarFieldEnum[];
};
export type DeliveryRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where?: Prisma.DeliveryRequestWhereInput;
    orderBy?: Prisma.DeliveryRequestOrderByWithRelationInput | Prisma.DeliveryRequestOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryRequestScalarFieldEnum | Prisma.DeliveryRequestScalarFieldEnum[];
};
export type DeliveryRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where?: Prisma.DeliveryRequestWhereInput;
    orderBy?: Prisma.DeliveryRequestOrderByWithRelationInput | Prisma.DeliveryRequestOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryRequestScalarFieldEnum | Prisma.DeliveryRequestScalarFieldEnum[];
};
export type DeliveryRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeliveryRequestCreateInput, Prisma.DeliveryRequestUncheckedCreateInput>;
};
export type DeliveryRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DeliveryRequestCreateManyInput | Prisma.DeliveryRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DeliveryRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    data: Prisma.DeliveryRequestCreateManyInput | Prisma.DeliveryRequestCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DeliveryRequestIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DeliveryRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeliveryRequestUpdateInput, Prisma.DeliveryRequestUncheckedUpdateInput>;
    where: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DeliveryRequestUpdateManyMutationInput, Prisma.DeliveryRequestUncheckedUpdateManyInput>;
    where?: Prisma.DeliveryRequestWhereInput;
    limit?: number;
};
export type DeliveryRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeliveryRequestUpdateManyMutationInput, Prisma.DeliveryRequestUncheckedUpdateManyInput>;
    where?: Prisma.DeliveryRequestWhereInput;
    limit?: number;
    include?: Prisma.DeliveryRequestIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DeliveryRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where: Prisma.DeliveryRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeliveryRequestCreateInput, Prisma.DeliveryRequestUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DeliveryRequestUpdateInput, Prisma.DeliveryRequestUncheckedUpdateInput>;
};
export type DeliveryRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
    where: Prisma.DeliveryRequestWhereUniqueInput;
};
export type DeliveryRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryRequestWhereInput;
    limit?: number;
};
export type DeliveryRequest$orderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
};
export type DeliveryRequest$partOrderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartOrderSelect<ExtArgs> | null;
    omit?: Prisma.PartOrderOmit<ExtArgs> | null;
    include?: Prisma.PartOrderInclude<ExtArgs> | null;
    where?: Prisma.PartOrderWhereInput;
};
export type DeliveryRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryRequestSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryRequestOmit<ExtArgs> | null;
    include?: Prisma.DeliveryRequestInclude<ExtArgs> | null;
};
