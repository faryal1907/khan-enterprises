import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type OrderAlertModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderAlertPayload>;
export type AggregateOrderAlert = {
    _count: OrderAlertCountAggregateOutputType | null;
    _min: OrderAlertMinAggregateOutputType | null;
    _max: OrderAlertMaxAggregateOutputType | null;
};
export type OrderAlertMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    partOrderId: string | null;
    userId: string | null;
    isRead: boolean | null;
    alertType: string | null;
    createdAt: Date | null;
};
export type OrderAlertMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    partOrderId: string | null;
    userId: string | null;
    isRead: boolean | null;
    alertType: string | null;
    createdAt: Date | null;
};
export type OrderAlertCountAggregateOutputType = {
    id: number;
    orderId: number;
    partOrderId: number;
    userId: number;
    isRead: number;
    alertType: number;
    createdAt: number;
    _all: number;
};
export type OrderAlertMinAggregateInputType = {
    id?: true;
    orderId?: true;
    partOrderId?: true;
    userId?: true;
    isRead?: true;
    alertType?: true;
    createdAt?: true;
};
export type OrderAlertMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    partOrderId?: true;
    userId?: true;
    isRead?: true;
    alertType?: true;
    createdAt?: true;
};
export type OrderAlertCountAggregateInputType = {
    id?: true;
    orderId?: true;
    partOrderId?: true;
    userId?: true;
    isRead?: true;
    alertType?: true;
    createdAt?: true;
    _all?: true;
};
export type OrderAlertAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderAlertWhereInput;
    orderBy?: Prisma.OrderAlertOrderByWithRelationInput | Prisma.OrderAlertOrderByWithRelationInput[];
    cursor?: Prisma.OrderAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrderAlertCountAggregateInputType;
    _min?: OrderAlertMinAggregateInputType;
    _max?: OrderAlertMaxAggregateInputType;
};
export type GetOrderAlertAggregateType<T extends OrderAlertAggregateArgs> = {
    [P in keyof T & keyof AggregateOrderAlert]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrderAlert[P]> : Prisma.GetScalarType<T[P], AggregateOrderAlert[P]>;
};
export type OrderAlertGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderAlertWhereInput;
    orderBy?: Prisma.OrderAlertOrderByWithAggregationInput | Prisma.OrderAlertOrderByWithAggregationInput[];
    by: Prisma.OrderAlertScalarFieldEnum[] | Prisma.OrderAlertScalarFieldEnum;
    having?: Prisma.OrderAlertScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderAlertCountAggregateInputType | true;
    _min?: OrderAlertMinAggregateInputType;
    _max?: OrderAlertMaxAggregateInputType;
};
export type OrderAlertGroupByOutputType = {
    id: string;
    orderId: string | null;
    partOrderId: string | null;
    userId: string;
    isRead: boolean;
    alertType: string;
    createdAt: Date;
    _count: OrderAlertCountAggregateOutputType | null;
    _min: OrderAlertMinAggregateOutputType | null;
    _max: OrderAlertMaxAggregateOutputType | null;
};
export type GetOrderAlertGroupByPayload<T extends OrderAlertGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderAlertGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderAlertGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderAlertGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderAlertGroupByOutputType[P]>;
}>>;
export type OrderAlertWhereInput = {
    AND?: Prisma.OrderAlertWhereInput | Prisma.OrderAlertWhereInput[];
    OR?: Prisma.OrderAlertWhereInput[];
    NOT?: Prisma.OrderAlertWhereInput | Prisma.OrderAlertWhereInput[];
    id?: Prisma.StringFilter<"OrderAlert"> | string;
    orderId?: Prisma.StringNullableFilter<"OrderAlert"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"OrderAlert"> | string | null;
    userId?: Prisma.StringFilter<"OrderAlert"> | string;
    isRead?: Prisma.BoolFilter<"OrderAlert"> | boolean;
    alertType?: Prisma.StringFilter<"OrderAlert"> | string;
    createdAt?: Prisma.DateTimeFilter<"OrderAlert"> | Date | string;
    order?: Prisma.XOR<Prisma.OrderNullableScalarRelationFilter, Prisma.OrderWhereInput> | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderNullableScalarRelationFilter, Prisma.PartOrderWhereInput> | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type OrderAlertOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    alertType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    order?: Prisma.OrderOrderByWithRelationInput;
    partOrder?: Prisma.PartOrderOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type OrderAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OrderAlertWhereInput | Prisma.OrderAlertWhereInput[];
    OR?: Prisma.OrderAlertWhereInput[];
    NOT?: Prisma.OrderAlertWhereInput | Prisma.OrderAlertWhereInput[];
    orderId?: Prisma.StringNullableFilter<"OrderAlert"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"OrderAlert"> | string | null;
    userId?: Prisma.StringFilter<"OrderAlert"> | string;
    isRead?: Prisma.BoolFilter<"OrderAlert"> | boolean;
    alertType?: Prisma.StringFilter<"OrderAlert"> | string;
    createdAt?: Prisma.DateTimeFilter<"OrderAlert"> | Date | string;
    order?: Prisma.XOR<Prisma.OrderNullableScalarRelationFilter, Prisma.OrderWhereInput> | null;
    partOrder?: Prisma.XOR<Prisma.PartOrderNullableScalarRelationFilter, Prisma.PartOrderWhereInput> | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type OrderAlertOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    partOrderId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    alertType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OrderAlertCountOrderByAggregateInput;
    _max?: Prisma.OrderAlertMaxOrderByAggregateInput;
    _min?: Prisma.OrderAlertMinOrderByAggregateInput;
};
export type OrderAlertScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderAlertScalarWhereWithAggregatesInput | Prisma.OrderAlertScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderAlertScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderAlertScalarWhereWithAggregatesInput | Prisma.OrderAlertScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OrderAlert"> | string;
    orderId?: Prisma.StringNullableWithAggregatesFilter<"OrderAlert"> | string | null;
    partOrderId?: Prisma.StringNullableWithAggregatesFilter<"OrderAlert"> | string | null;
    userId?: Prisma.StringWithAggregatesFilter<"OrderAlert"> | string;
    isRead?: Prisma.BoolWithAggregatesFilter<"OrderAlert"> | boolean;
    alertType?: Prisma.StringWithAggregatesFilter<"OrderAlert"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OrderAlert"> | Date | string;
};
export type OrderAlertCreateInput = {
    id?: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutAlertsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAlertsInput;
    user: Prisma.UserCreateNestedOneWithoutOrderAlertsInput;
};
export type OrderAlertUncheckedCreateInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    userId: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    order?: Prisma.OrderUpdateOneWithoutAlertsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAlertsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutOrderAlertsNestedInput;
};
export type OrderAlertUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertCreateManyInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    userId: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertListRelationFilter = {
    every?: Prisma.OrderAlertWhereInput;
    some?: Prisma.OrderAlertWhereInput;
    none?: Prisma.OrderAlertWhereInput;
};
export type OrderAlertOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderAlertCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    alertType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OrderAlertMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    alertType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OrderAlertMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    partOrderId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    alertType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OrderAlertCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutUserInput, Prisma.OrderAlertUncheckedCreateWithoutUserInput> | Prisma.OrderAlertCreateWithoutUserInput[] | Prisma.OrderAlertUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutUserInput | Prisma.OrderAlertCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OrderAlertCreateManyUserInputEnvelope;
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
};
export type OrderAlertUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutUserInput, Prisma.OrderAlertUncheckedCreateWithoutUserInput> | Prisma.OrderAlertCreateWithoutUserInput[] | Prisma.OrderAlertUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutUserInput | Prisma.OrderAlertCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OrderAlertCreateManyUserInputEnvelope;
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
};
export type OrderAlertUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutUserInput, Prisma.OrderAlertUncheckedCreateWithoutUserInput> | Prisma.OrderAlertCreateWithoutUserInput[] | Prisma.OrderAlertUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutUserInput | Prisma.OrderAlertCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OrderAlertUpsertWithWhereUniqueWithoutUserInput | Prisma.OrderAlertUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OrderAlertCreateManyUserInputEnvelope;
    set?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    disconnect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    delete?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    update?: Prisma.OrderAlertUpdateWithWhereUniqueWithoutUserInput | Prisma.OrderAlertUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OrderAlertUpdateManyWithWhereWithoutUserInput | Prisma.OrderAlertUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
};
export type OrderAlertUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutUserInput, Prisma.OrderAlertUncheckedCreateWithoutUserInput> | Prisma.OrderAlertCreateWithoutUserInput[] | Prisma.OrderAlertUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutUserInput | Prisma.OrderAlertCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OrderAlertUpsertWithWhereUniqueWithoutUserInput | Prisma.OrderAlertUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OrderAlertCreateManyUserInputEnvelope;
    set?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    disconnect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    delete?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    update?: Prisma.OrderAlertUpdateWithWhereUniqueWithoutUserInput | Prisma.OrderAlertUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OrderAlertUpdateManyWithWhereWithoutUserInput | Prisma.OrderAlertUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
};
export type OrderAlertCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutOrderInput, Prisma.OrderAlertUncheckedCreateWithoutOrderInput> | Prisma.OrderAlertCreateWithoutOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutOrderInput | Prisma.OrderAlertCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyOrderInputEnvelope;
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
};
export type OrderAlertUncheckedCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutOrderInput, Prisma.OrderAlertUncheckedCreateWithoutOrderInput> | Prisma.OrderAlertCreateWithoutOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutOrderInput | Prisma.OrderAlertCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyOrderInputEnvelope;
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
};
export type OrderAlertUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutOrderInput, Prisma.OrderAlertUncheckedCreateWithoutOrderInput> | Prisma.OrderAlertCreateWithoutOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutOrderInput | Prisma.OrderAlertCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.OrderAlertUpsertWithWhereUniqueWithoutOrderInput | Prisma.OrderAlertUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyOrderInputEnvelope;
    set?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    disconnect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    delete?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    update?: Prisma.OrderAlertUpdateWithWhereUniqueWithoutOrderInput | Prisma.OrderAlertUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.OrderAlertUpdateManyWithWhereWithoutOrderInput | Prisma.OrderAlertUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
};
export type OrderAlertUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutOrderInput, Prisma.OrderAlertUncheckedCreateWithoutOrderInput> | Prisma.OrderAlertCreateWithoutOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutOrderInput | Prisma.OrderAlertCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.OrderAlertUpsertWithWhereUniqueWithoutOrderInput | Prisma.OrderAlertUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyOrderInputEnvelope;
    set?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    disconnect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    delete?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    update?: Prisma.OrderAlertUpdateWithWhereUniqueWithoutOrderInput | Prisma.OrderAlertUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.OrderAlertUpdateManyWithWhereWithoutOrderInput | Prisma.OrderAlertUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
};
export type OrderAlertCreateNestedManyWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutPartOrderInput, Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput> | Prisma.OrderAlertCreateWithoutPartOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput | Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyPartOrderInputEnvelope;
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
};
export type OrderAlertUncheckedCreateNestedManyWithoutPartOrderInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutPartOrderInput, Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput> | Prisma.OrderAlertCreateWithoutPartOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput | Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyPartOrderInputEnvelope;
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
};
export type OrderAlertUpdateManyWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutPartOrderInput, Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput> | Prisma.OrderAlertCreateWithoutPartOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput | Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput[];
    upsert?: Prisma.OrderAlertUpsertWithWhereUniqueWithoutPartOrderInput | Prisma.OrderAlertUpsertWithWhereUniqueWithoutPartOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyPartOrderInputEnvelope;
    set?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    disconnect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    delete?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    update?: Prisma.OrderAlertUpdateWithWhereUniqueWithoutPartOrderInput | Prisma.OrderAlertUpdateWithWhereUniqueWithoutPartOrderInput[];
    updateMany?: Prisma.OrderAlertUpdateManyWithWhereWithoutPartOrderInput | Prisma.OrderAlertUpdateManyWithWhereWithoutPartOrderInput[];
    deleteMany?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
};
export type OrderAlertUncheckedUpdateManyWithoutPartOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderAlertCreateWithoutPartOrderInput, Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput> | Prisma.OrderAlertCreateWithoutPartOrderInput[] | Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput[];
    connectOrCreate?: Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput | Prisma.OrderAlertCreateOrConnectWithoutPartOrderInput[];
    upsert?: Prisma.OrderAlertUpsertWithWhereUniqueWithoutPartOrderInput | Prisma.OrderAlertUpsertWithWhereUniqueWithoutPartOrderInput[];
    createMany?: Prisma.OrderAlertCreateManyPartOrderInputEnvelope;
    set?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    disconnect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    delete?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    connect?: Prisma.OrderAlertWhereUniqueInput | Prisma.OrderAlertWhereUniqueInput[];
    update?: Prisma.OrderAlertUpdateWithWhereUniqueWithoutPartOrderInput | Prisma.OrderAlertUpdateWithWhereUniqueWithoutPartOrderInput[];
    updateMany?: Prisma.OrderAlertUpdateManyWithWhereWithoutPartOrderInput | Prisma.OrderAlertUpdateManyWithWhereWithoutPartOrderInput[];
    deleteMany?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
};
export type OrderAlertCreateWithoutUserInput = {
    id?: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutAlertsInput;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAlertsInput;
};
export type OrderAlertUncheckedCreateWithoutUserInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertCreateOrConnectWithoutUserInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderAlertCreateWithoutUserInput, Prisma.OrderAlertUncheckedCreateWithoutUserInput>;
};
export type OrderAlertCreateManyUserInputEnvelope = {
    data: Prisma.OrderAlertCreateManyUserInput | Prisma.OrderAlertCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type OrderAlertUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderAlertUpdateWithoutUserInput, Prisma.OrderAlertUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.OrderAlertCreateWithoutUserInput, Prisma.OrderAlertUncheckedCreateWithoutUserInput>;
};
export type OrderAlertUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderAlertUpdateWithoutUserInput, Prisma.OrderAlertUncheckedUpdateWithoutUserInput>;
};
export type OrderAlertUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.OrderAlertScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderAlertUpdateManyMutationInput, Prisma.OrderAlertUncheckedUpdateManyWithoutUserInput>;
};
export type OrderAlertScalarWhereInput = {
    AND?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
    OR?: Prisma.OrderAlertScalarWhereInput[];
    NOT?: Prisma.OrderAlertScalarWhereInput | Prisma.OrderAlertScalarWhereInput[];
    id?: Prisma.StringFilter<"OrderAlert"> | string;
    orderId?: Prisma.StringNullableFilter<"OrderAlert"> | string | null;
    partOrderId?: Prisma.StringNullableFilter<"OrderAlert"> | string | null;
    userId?: Prisma.StringFilter<"OrderAlert"> | string;
    isRead?: Prisma.BoolFilter<"OrderAlert"> | boolean;
    alertType?: Prisma.StringFilter<"OrderAlert"> | string;
    createdAt?: Prisma.DateTimeFilter<"OrderAlert"> | Date | string;
};
export type OrderAlertCreateWithoutOrderInput = {
    id?: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
    partOrder?: Prisma.PartOrderCreateNestedOneWithoutAlertsInput;
    user: Prisma.UserCreateNestedOneWithoutOrderAlertsInput;
};
export type OrderAlertUncheckedCreateWithoutOrderInput = {
    id?: string;
    partOrderId?: string | null;
    userId: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertCreateOrConnectWithoutOrderInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderAlertCreateWithoutOrderInput, Prisma.OrderAlertUncheckedCreateWithoutOrderInput>;
};
export type OrderAlertCreateManyOrderInputEnvelope = {
    data: Prisma.OrderAlertCreateManyOrderInput | Prisma.OrderAlertCreateManyOrderInput[];
    skipDuplicates?: boolean;
};
export type OrderAlertUpsertWithWhereUniqueWithoutOrderInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderAlertUpdateWithoutOrderInput, Prisma.OrderAlertUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.OrderAlertCreateWithoutOrderInput, Prisma.OrderAlertUncheckedCreateWithoutOrderInput>;
};
export type OrderAlertUpdateWithWhereUniqueWithoutOrderInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderAlertUpdateWithoutOrderInput, Prisma.OrderAlertUncheckedUpdateWithoutOrderInput>;
};
export type OrderAlertUpdateManyWithWhereWithoutOrderInput = {
    where: Prisma.OrderAlertScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderAlertUpdateManyMutationInput, Prisma.OrderAlertUncheckedUpdateManyWithoutOrderInput>;
};
export type OrderAlertCreateWithoutPartOrderInput = {
    id?: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
    order?: Prisma.OrderCreateNestedOneWithoutAlertsInput;
    user: Prisma.UserCreateNestedOneWithoutOrderAlertsInput;
};
export type OrderAlertUncheckedCreateWithoutPartOrderInput = {
    id?: string;
    orderId?: string | null;
    userId: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertCreateOrConnectWithoutPartOrderInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderAlertCreateWithoutPartOrderInput, Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput>;
};
export type OrderAlertCreateManyPartOrderInputEnvelope = {
    data: Prisma.OrderAlertCreateManyPartOrderInput | Prisma.OrderAlertCreateManyPartOrderInput[];
    skipDuplicates?: boolean;
};
export type OrderAlertUpsertWithWhereUniqueWithoutPartOrderInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderAlertUpdateWithoutPartOrderInput, Prisma.OrderAlertUncheckedUpdateWithoutPartOrderInput>;
    create: Prisma.XOR<Prisma.OrderAlertCreateWithoutPartOrderInput, Prisma.OrderAlertUncheckedCreateWithoutPartOrderInput>;
};
export type OrderAlertUpdateWithWhereUniqueWithoutPartOrderInput = {
    where: Prisma.OrderAlertWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderAlertUpdateWithoutPartOrderInput, Prisma.OrderAlertUncheckedUpdateWithoutPartOrderInput>;
};
export type OrderAlertUpdateManyWithWhereWithoutPartOrderInput = {
    where: Prisma.OrderAlertScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderAlertUpdateManyMutationInput, Prisma.OrderAlertUncheckedUpdateManyWithoutPartOrderInput>;
};
export type OrderAlertCreateManyUserInput = {
    id?: string;
    orderId?: string | null;
    partOrderId?: string | null;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    order?: Prisma.OrderUpdateOneWithoutAlertsNestedInput;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAlertsNestedInput;
};
export type OrderAlertUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertCreateManyOrderInput = {
    id?: string;
    partOrderId?: string | null;
    userId: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    partOrder?: Prisma.PartOrderUpdateOneWithoutAlertsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutOrderAlertsNestedInput;
};
export type OrderAlertUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertUncheckedUpdateManyWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    partOrderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertCreateManyPartOrderInput = {
    id?: string;
    orderId?: string | null;
    userId: string;
    isRead?: boolean;
    alertType: string;
    createdAt?: Date | string;
};
export type OrderAlertUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    order?: Prisma.OrderUpdateOneWithoutAlertsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutOrderAlertsNestedInput;
};
export type OrderAlertUncheckedUpdateWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertUncheckedUpdateManyWithoutPartOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    alertType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderAlertSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    userId?: boolean;
    isRead?: boolean;
    alertType?: boolean;
    createdAt?: boolean;
    order?: boolean | Prisma.OrderAlert$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.OrderAlert$partOrderArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderAlert"]>;
export type OrderAlertSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    userId?: boolean;
    isRead?: boolean;
    alertType?: boolean;
    createdAt?: boolean;
    order?: boolean | Prisma.OrderAlert$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.OrderAlert$partOrderArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderAlert"]>;
export type OrderAlertSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    userId?: boolean;
    isRead?: boolean;
    alertType?: boolean;
    createdAt?: boolean;
    order?: boolean | Prisma.OrderAlert$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.OrderAlert$partOrderArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderAlert"]>;
export type OrderAlertSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    partOrderId?: boolean;
    userId?: boolean;
    isRead?: boolean;
    alertType?: boolean;
    createdAt?: boolean;
};
export type OrderAlertOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderId" | "partOrderId" | "userId" | "isRead" | "alertType" | "createdAt", ExtArgs["result"]["orderAlert"]>;
export type OrderAlertInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderAlert$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.OrderAlert$partOrderArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type OrderAlertIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderAlert$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.OrderAlert$partOrderArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type OrderAlertIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderAlert$orderArgs<ExtArgs>;
    partOrder?: boolean | Prisma.OrderAlert$partOrderArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $OrderAlertPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OrderAlert";
    objects: {
        order: Prisma.$OrderPayload<ExtArgs> | null;
        partOrder: Prisma.$PartOrderPayload<ExtArgs> | null;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orderId: string | null;
        partOrderId: string | null;
        userId: string;
        isRead: boolean;
        alertType: string;
        createdAt: Date;
    }, ExtArgs["result"]["orderAlert"]>;
    composites: {};
};
export type OrderAlertGetPayload<S extends boolean | null | undefined | OrderAlertDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload, S>;
export type OrderAlertCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderAlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderAlertCountAggregateInputType | true;
};
export interface OrderAlertDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OrderAlert'];
        meta: {
            name: 'OrderAlert';
        };
    };
    findUnique<T extends OrderAlertFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderAlertFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrderAlertFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrderAlertFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderAlertFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrderAlertFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrderAlertFindManyArgs>(args?: Prisma.SelectSubset<T, OrderAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrderAlertCreateArgs>(args: Prisma.SelectSubset<T, OrderAlertCreateArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrderAlertCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrderAlertCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrderAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrderAlertDeleteArgs>(args: Prisma.SelectSubset<T, OrderAlertDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrderAlertUpdateArgs>(args: Prisma.SelectSubset<T, OrderAlertUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrderAlertDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrderAlertUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrderAlertUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrderAlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrderAlertUpsertArgs>(args: Prisma.SelectSubset<T, OrderAlertUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderAlertClient<runtime.Types.Result.GetResult<Prisma.$OrderAlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrderAlertCountArgs>(args?: Prisma.Subset<T, OrderAlertCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderAlertCountAggregateOutputType> : number>;
    aggregate<T extends OrderAlertAggregateArgs>(args: Prisma.Subset<T, OrderAlertAggregateArgs>): Prisma.PrismaPromise<GetOrderAlertAggregateType<T>>;
    groupBy<T extends OrderAlertGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderAlertGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderAlertGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrderAlertFieldRefs;
}
export interface Prisma__OrderAlertClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    order<T extends Prisma.OrderAlert$orderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrderAlert$orderArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    partOrder<T extends Prisma.OrderAlert$partOrderArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrderAlert$partOrderArgs<ExtArgs>>): Prisma.Prisma__PartOrderClient<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrderAlertFieldRefs {
    readonly id: Prisma.FieldRef<"OrderAlert", 'String'>;
    readonly orderId: Prisma.FieldRef<"OrderAlert", 'String'>;
    readonly partOrderId: Prisma.FieldRef<"OrderAlert", 'String'>;
    readonly userId: Prisma.FieldRef<"OrderAlert", 'String'>;
    readonly isRead: Prisma.FieldRef<"OrderAlert", 'Boolean'>;
    readonly alertType: Prisma.FieldRef<"OrderAlert", 'String'>;
    readonly createdAt: Prisma.FieldRef<"OrderAlert", 'DateTime'>;
}
export type OrderAlertFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where: Prisma.OrderAlertWhereUniqueInput;
};
export type OrderAlertFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where: Prisma.OrderAlertWhereUniqueInput;
};
export type OrderAlertFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where?: Prisma.OrderAlertWhereInput;
    orderBy?: Prisma.OrderAlertOrderByWithRelationInput | Prisma.OrderAlertOrderByWithRelationInput[];
    cursor?: Prisma.OrderAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderAlertScalarFieldEnum | Prisma.OrderAlertScalarFieldEnum[];
};
export type OrderAlertFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where?: Prisma.OrderAlertWhereInput;
    orderBy?: Prisma.OrderAlertOrderByWithRelationInput | Prisma.OrderAlertOrderByWithRelationInput[];
    cursor?: Prisma.OrderAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderAlertScalarFieldEnum | Prisma.OrderAlertScalarFieldEnum[];
};
export type OrderAlertFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where?: Prisma.OrderAlertWhereInput;
    orderBy?: Prisma.OrderAlertOrderByWithRelationInput | Prisma.OrderAlertOrderByWithRelationInput[];
    cursor?: Prisma.OrderAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderAlertScalarFieldEnum | Prisma.OrderAlertScalarFieldEnum[];
};
export type OrderAlertCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderAlertCreateInput, Prisma.OrderAlertUncheckedCreateInput>;
};
export type OrderAlertCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrderAlertCreateManyInput | Prisma.OrderAlertCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrderAlertCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    data: Prisma.OrderAlertCreateManyInput | Prisma.OrderAlertCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OrderAlertIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OrderAlertUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderAlertUpdateInput, Prisma.OrderAlertUncheckedUpdateInput>;
    where: Prisma.OrderAlertWhereUniqueInput;
};
export type OrderAlertUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrderAlertUpdateManyMutationInput, Prisma.OrderAlertUncheckedUpdateManyInput>;
    where?: Prisma.OrderAlertWhereInput;
    limit?: number;
};
export type OrderAlertUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderAlertUpdateManyMutationInput, Prisma.OrderAlertUncheckedUpdateManyInput>;
    where?: Prisma.OrderAlertWhereInput;
    limit?: number;
    include?: Prisma.OrderAlertIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OrderAlertUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where: Prisma.OrderAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderAlertCreateInput, Prisma.OrderAlertUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrderAlertUpdateInput, Prisma.OrderAlertUncheckedUpdateInput>;
};
export type OrderAlertDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
    where: Prisma.OrderAlertWhereUniqueInput;
};
export type OrderAlertDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderAlertWhereInput;
    limit?: number;
};
export type OrderAlert$orderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
};
export type OrderAlert$partOrderArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartOrderSelect<ExtArgs> | null;
    omit?: Prisma.PartOrderOmit<ExtArgs> | null;
    include?: Prisma.PartOrderInclude<ExtArgs> | null;
    where?: Prisma.PartOrderWhereInput;
};
export type OrderAlertDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderAlertSelect<ExtArgs> | null;
    omit?: Prisma.OrderAlertOmit<ExtArgs> | null;
    include?: Prisma.OrderAlertInclude<ExtArgs> | null;
};
