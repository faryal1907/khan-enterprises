import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type VendorModel = runtime.Types.Result.DefaultSelection<Prisma.$VendorPayload>;
export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null;
    _min: VendorMinAggregateOutputType | null;
    _max: VendorMaxAggregateOutputType | null;
};
export type VendorMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    contactPerson: string | null;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    contactPerson: string | null;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VendorCountAggregateOutputType = {
    id: number;
    name: number;
    contactPerson: number;
    phoneNumber: number;
    email: number;
    address: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type VendorMinAggregateInputType = {
    id?: true;
    name?: true;
    contactPerson?: true;
    phoneNumber?: true;
    email?: true;
    address?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorMaxAggregateInputType = {
    id?: true;
    name?: true;
    contactPerson?: true;
    phoneNumber?: true;
    email?: true;
    address?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VendorCountAggregateInputType = {
    id?: true;
    name?: true;
    contactPerson?: true;
    phoneNumber?: true;
    email?: true;
    address?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type VendorAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VendorCountAggregateInputType;
    _min?: VendorMinAggregateInputType;
    _max?: VendorMaxAggregateInputType;
};
export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
    [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVendor[P]> : Prisma.GetScalarType<T[P], AggregateVendor[P]>;
};
export type VendorGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithAggregationInput | Prisma.VendorOrderByWithAggregationInput[];
    by: Prisma.VendorScalarFieldEnum[] | Prisma.VendorScalarFieldEnum;
    having?: Prisma.VendorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorCountAggregateInputType | true;
    _min?: VendorMinAggregateInputType;
    _max?: VendorMaxAggregateInputType;
};
export type VendorGroupByOutputType = {
    id: string;
    name: string;
    contactPerson: string | null;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorCountAggregateOutputType | null;
    _min: VendorMinAggregateOutputType | null;
    _max: VendorMaxAggregateOutputType | null;
};
export type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VendorGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VendorGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VendorGroupByOutputType[P]>;
}>>;
export type VendorWhereInput = {
    AND?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    OR?: Prisma.VendorWhereInput[];
    NOT?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    id?: Prisma.StringFilter<"Vendor"> | string;
    name?: Prisma.StringFilter<"Vendor"> | string;
    contactPerson?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    phoneNumber?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    email?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    address?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    isActive?: Prisma.BoolFilter<"Vendor"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    suppliedBikes?: Prisma.BikeUnitListRelationFilter;
    staff?: Prisma.UserListRelationFilter;
    purchaseOrders?: Prisma.PurchaseOrderListRelationFilter;
    payments?: Prisma.VendorPaymentListRelationFilter;
    allocations?: Prisma.VendorAllocationListRelationFilter;
};
export type VendorOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    contactPerson?: Prisma.SortOrderInput | Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    suppliedBikes?: Prisma.BikeUnitOrderByRelationAggregateInput;
    staff?: Prisma.UserOrderByRelationAggregateInput;
    purchaseOrders?: Prisma.PurchaseOrderOrderByRelationAggregateInput;
    payments?: Prisma.VendorPaymentOrderByRelationAggregateInput;
    allocations?: Prisma.VendorAllocationOrderByRelationAggregateInput;
};
export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    OR?: Prisma.VendorWhereInput[];
    NOT?: Prisma.VendorWhereInput | Prisma.VendorWhereInput[];
    name?: Prisma.StringFilter<"Vendor"> | string;
    contactPerson?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    phoneNumber?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    email?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    address?: Prisma.StringNullableFilter<"Vendor"> | string | null;
    isActive?: Prisma.BoolFilter<"Vendor"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Vendor"> | Date | string;
    suppliedBikes?: Prisma.BikeUnitListRelationFilter;
    staff?: Prisma.UserListRelationFilter;
    purchaseOrders?: Prisma.PurchaseOrderListRelationFilter;
    payments?: Prisma.VendorPaymentListRelationFilter;
    allocations?: Prisma.VendorAllocationListRelationFilter;
}, "id">;
export type VendorOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    contactPerson?: Prisma.SortOrderInput | Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VendorCountOrderByAggregateInput;
    _max?: Prisma.VendorMaxOrderByAggregateInput;
    _min?: Prisma.VendorMinOrderByAggregateInput;
};
export type VendorScalarWhereWithAggregatesInput = {
    AND?: Prisma.VendorScalarWhereWithAggregatesInput | Prisma.VendorScalarWhereWithAggregatesInput[];
    OR?: Prisma.VendorScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VendorScalarWhereWithAggregatesInput | Prisma.VendorScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Vendor"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Vendor"> | string;
    contactPerson?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    phoneNumber?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"Vendor"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"Vendor"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Vendor"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Vendor"> | Date | string;
};
export type VendorCreateInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserUncheckedCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUncheckedUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCreateManyInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VendorUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VendorNullableScalarRelationFilter = {
    is?: Prisma.VendorWhereInput | null;
    isNot?: Prisma.VendorWhereInput | null;
};
export type VendorCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    contactPerson?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    contactPerson?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    contactPerson?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VendorScalarRelationFilter = {
    is?: Prisma.VendorWhereInput;
    isNot?: Prisma.VendorWhereInput;
};
export type VendorCreateNestedOneWithoutStaffInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutStaffInput, Prisma.VendorUncheckedCreateWithoutStaffInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutStaffInput;
    connect?: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateOneWithoutStaffNestedInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutStaffInput, Prisma.VendorUncheckedCreateWithoutStaffInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutStaffInput;
    upsert?: Prisma.VendorUpsertWithoutStaffInput;
    disconnect?: Prisma.VendorWhereInput | boolean;
    delete?: Prisma.VendorWhereInput | boolean;
    connect?: Prisma.VendorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorUpdateToOneWithWhereWithoutStaffInput, Prisma.VendorUpdateWithoutStaffInput>, Prisma.VendorUncheckedUpdateWithoutStaffInput>;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type VendorCreateNestedOneWithoutSuppliedBikesInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutSuppliedBikesInput, Prisma.VendorUncheckedCreateWithoutSuppliedBikesInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutSuppliedBikesInput;
    connect?: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateOneRequiredWithoutSuppliedBikesNestedInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutSuppliedBikesInput, Prisma.VendorUncheckedCreateWithoutSuppliedBikesInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutSuppliedBikesInput;
    upsert?: Prisma.VendorUpsertWithoutSuppliedBikesInput;
    connect?: Prisma.VendorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorUpdateToOneWithWhereWithoutSuppliedBikesInput, Prisma.VendorUpdateWithoutSuppliedBikesInput>, Prisma.VendorUncheckedUpdateWithoutSuppliedBikesInput>;
};
export type VendorCreateNestedOneWithoutPurchaseOrdersInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrdersInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrdersInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutPurchaseOrdersInput;
    connect?: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateOneRequiredWithoutPurchaseOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrdersInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrdersInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutPurchaseOrdersInput;
    upsert?: Prisma.VendorUpsertWithoutPurchaseOrdersInput;
    connect?: Prisma.VendorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorUpdateToOneWithWhereWithoutPurchaseOrdersInput, Prisma.VendorUpdateWithoutPurchaseOrdersInput>, Prisma.VendorUncheckedUpdateWithoutPurchaseOrdersInput>;
};
export type VendorCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutPaymentsInput, Prisma.VendorUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutPaymentsInput, Prisma.VendorUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.VendorUpsertWithoutPaymentsInput;
    connect?: Prisma.VendorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorUpdateToOneWithWhereWithoutPaymentsInput, Prisma.VendorUpdateWithoutPaymentsInput>, Prisma.VendorUncheckedUpdateWithoutPaymentsInput>;
};
export type VendorCreateNestedOneWithoutAllocationsInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutAllocationsInput, Prisma.VendorUncheckedCreateWithoutAllocationsInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutAllocationsInput;
    connect?: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateOneRequiredWithoutAllocationsNestedInput = {
    create?: Prisma.XOR<Prisma.VendorCreateWithoutAllocationsInput, Prisma.VendorUncheckedCreateWithoutAllocationsInput>;
    connectOrCreate?: Prisma.VendorCreateOrConnectWithoutAllocationsInput;
    upsert?: Prisma.VendorUpsertWithoutAllocationsInput;
    connect?: Prisma.VendorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VendorUpdateToOneWithWhereWithoutAllocationsInput, Prisma.VendorUpdateWithoutAllocationsInput>, Prisma.VendorUncheckedUpdateWithoutAllocationsInput>;
};
export type VendorCreateWithoutStaffInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateWithoutStaffInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorCreateOrConnectWithoutStaffInput = {
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateWithoutStaffInput, Prisma.VendorUncheckedCreateWithoutStaffInput>;
};
export type VendorUpsertWithoutStaffInput = {
    update: Prisma.XOR<Prisma.VendorUpdateWithoutStaffInput, Prisma.VendorUncheckedUpdateWithoutStaffInput>;
    create: Prisma.XOR<Prisma.VendorCreateWithoutStaffInput, Prisma.VendorUncheckedCreateWithoutStaffInput>;
    where?: Prisma.VendorWhereInput;
};
export type VendorUpdateToOneWithWhereWithoutStaffInput = {
    where?: Prisma.VendorWhereInput;
    data: Prisma.XOR<Prisma.VendorUpdateWithoutStaffInput, Prisma.VendorUncheckedUpdateWithoutStaffInput>;
};
export type VendorUpdateWithoutStaffInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateWithoutStaffInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCreateWithoutSuppliedBikesInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    staff?: Prisma.UserCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateWithoutSuppliedBikesInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    staff?: Prisma.UserUncheckedCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorCreateOrConnectWithoutSuppliedBikesInput = {
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateWithoutSuppliedBikesInput, Prisma.VendorUncheckedCreateWithoutSuppliedBikesInput>;
};
export type VendorUpsertWithoutSuppliedBikesInput = {
    update: Prisma.XOR<Prisma.VendorUpdateWithoutSuppliedBikesInput, Prisma.VendorUncheckedUpdateWithoutSuppliedBikesInput>;
    create: Prisma.XOR<Prisma.VendorCreateWithoutSuppliedBikesInput, Prisma.VendorUncheckedCreateWithoutSuppliedBikesInput>;
    where?: Prisma.VendorWhereInput;
};
export type VendorUpdateToOneWithWhereWithoutSuppliedBikesInput = {
    where?: Prisma.VendorWhereInput;
    data: Prisma.XOR<Prisma.VendorUpdateWithoutSuppliedBikesInput, Prisma.VendorUncheckedUpdateWithoutSuppliedBikesInput>;
};
export type VendorUpdateWithoutSuppliedBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    staff?: Prisma.UserUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateWithoutSuppliedBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    staff?: Prisma.UserUncheckedUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCreateWithoutPurchaseOrdersInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateWithoutPurchaseOrdersInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserUncheckedCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorCreateOrConnectWithoutPurchaseOrdersInput = {
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrdersInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrdersInput>;
};
export type VendorUpsertWithoutPurchaseOrdersInput = {
    update: Prisma.XOR<Prisma.VendorUpdateWithoutPurchaseOrdersInput, Prisma.VendorUncheckedUpdateWithoutPurchaseOrdersInput>;
    create: Prisma.XOR<Prisma.VendorCreateWithoutPurchaseOrdersInput, Prisma.VendorUncheckedCreateWithoutPurchaseOrdersInput>;
    where?: Prisma.VendorWhereInput;
};
export type VendorUpdateToOneWithWhereWithoutPurchaseOrdersInput = {
    where?: Prisma.VendorWhereInput;
    data: Prisma.XOR<Prisma.VendorUpdateWithoutPurchaseOrdersInput, Prisma.VendorUncheckedUpdateWithoutPurchaseOrdersInput>;
};
export type VendorUpdateWithoutPurchaseOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateWithoutPurchaseOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUncheckedUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCreateWithoutPaymentsInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserUncheckedCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput;
    allocations?: Prisma.VendorAllocationUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateWithoutPaymentsInput, Prisma.VendorUncheckedCreateWithoutPaymentsInput>;
};
export type VendorUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.VendorUpdateWithoutPaymentsInput, Prisma.VendorUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.VendorCreateWithoutPaymentsInput, Prisma.VendorUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.VendorWhereInput;
};
export type VendorUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.VendorWhereInput;
    data: Prisma.XOR<Prisma.VendorUpdateWithoutPaymentsInput, Prisma.VendorUncheckedUpdateWithoutPaymentsInput>;
};
export type VendorUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUncheckedUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput;
    allocations?: Prisma.VendorAllocationUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCreateWithoutAllocationsInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentCreateNestedManyWithoutVendorInput;
};
export type VendorUncheckedCreateWithoutAllocationsInput = {
    id?: string;
    name: string;
    contactPerson?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutVendorInput;
    staff?: Prisma.UserUncheckedCreateNestedManyWithoutVendorInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput;
    payments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutVendorInput;
};
export type VendorCreateOrConnectWithoutAllocationsInput = {
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateWithoutAllocationsInput, Prisma.VendorUncheckedCreateWithoutAllocationsInput>;
};
export type VendorUpsertWithoutAllocationsInput = {
    update: Prisma.XOR<Prisma.VendorUpdateWithoutAllocationsInput, Prisma.VendorUncheckedUpdateWithoutAllocationsInput>;
    create: Prisma.XOR<Prisma.VendorCreateWithoutAllocationsInput, Prisma.VendorUncheckedCreateWithoutAllocationsInput>;
    where?: Prisma.VendorWhereInput;
};
export type VendorUpdateToOneWithWhereWithoutAllocationsInput = {
    where?: Prisma.VendorWhereInput;
    data: Prisma.XOR<Prisma.VendorUpdateWithoutAllocationsInput, Prisma.VendorUncheckedUpdateWithoutAllocationsInput>;
};
export type VendorUpdateWithoutAllocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUpdateManyWithoutVendorNestedInput;
};
export type VendorUncheckedUpdateWithoutAllocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    contactPerson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suppliedBikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutVendorNestedInput;
    staff?: Prisma.UserUncheckedUpdateManyWithoutVendorNestedInput;
    purchaseOrders?: Prisma.PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput;
    payments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutVendorNestedInput;
};
export type VendorCountOutputType = {
    suppliedBikes: number;
    staff: number;
    purchaseOrders: number;
    payments: number;
    allocations: number;
};
export type VendorCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    suppliedBikes?: boolean | VendorCountOutputTypeCountSuppliedBikesArgs;
    staff?: boolean | VendorCountOutputTypeCountStaffArgs;
    purchaseOrders?: boolean | VendorCountOutputTypeCountPurchaseOrdersArgs;
    payments?: boolean | VendorCountOutputTypeCountPaymentsArgs;
    allocations?: boolean | VendorCountOutputTypeCountAllocationsArgs;
};
export type VendorCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorCountOutputTypeSelect<ExtArgs> | null;
};
export type VendorCountOutputTypeCountSuppliedBikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeUnitWhereInput;
};
export type VendorCountOutputTypeCountStaffArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type VendorCountOutputTypeCountPurchaseOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseOrderWhereInput;
};
export type VendorCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorPaymentWhereInput;
};
export type VendorCountOutputTypeCountAllocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationWhereInput;
};
export type VendorSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    contactPerson?: boolean;
    phoneNumber?: boolean;
    email?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    suppliedBikes?: boolean | Prisma.Vendor$suppliedBikesArgs<ExtArgs>;
    staff?: boolean | Prisma.Vendor$staffArgs<ExtArgs>;
    purchaseOrders?: boolean | Prisma.Vendor$purchaseOrdersArgs<ExtArgs>;
    payments?: boolean | Prisma.Vendor$paymentsArgs<ExtArgs>;
    allocations?: boolean | Prisma.Vendor$allocationsArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vendor"]>;
export type VendorSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    contactPerson?: boolean;
    phoneNumber?: boolean;
    email?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vendor"]>;
export type VendorSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    contactPerson?: boolean;
    phoneNumber?: boolean;
    email?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["vendor"]>;
export type VendorSelectScalar = {
    id?: boolean;
    name?: boolean;
    contactPerson?: boolean;
    phoneNumber?: boolean;
    email?: boolean;
    address?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type VendorOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "contactPerson" | "phoneNumber" | "email" | "address" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["vendor"]>;
export type VendorInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    suppliedBikes?: boolean | Prisma.Vendor$suppliedBikesArgs<ExtArgs>;
    staff?: boolean | Prisma.Vendor$staffArgs<ExtArgs>;
    purchaseOrders?: boolean | Prisma.Vendor$purchaseOrdersArgs<ExtArgs>;
    payments?: boolean | Prisma.Vendor$paymentsArgs<ExtArgs>;
    allocations?: boolean | Prisma.Vendor$allocationsArgs<ExtArgs>;
    _count?: boolean | Prisma.VendorCountOutputTypeDefaultArgs<ExtArgs>;
};
export type VendorIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type VendorIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $VendorPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Vendor";
    objects: {
        suppliedBikes: Prisma.$BikeUnitPayload<ExtArgs>[];
        staff: Prisma.$UserPayload<ExtArgs>[];
        purchaseOrders: Prisma.$PurchaseOrderPayload<ExtArgs>[];
        payments: Prisma.$VendorPaymentPayload<ExtArgs>[];
        allocations: Prisma.$VendorAllocationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        contactPerson: string | null;
        phoneNumber: string | null;
        email: string | null;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["vendor"]>;
    composites: {};
};
export type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VendorPayload, S>;
export type VendorCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VendorCountAggregateInputType | true;
};
export interface VendorDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Vendor'];
        meta: {
            name: 'Vendor';
        };
    };
    findUnique<T extends VendorFindUniqueArgs>(args: Prisma.SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VendorFindFirstArgs>(args?: Prisma.SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VendorFindManyArgs>(args?: Prisma.SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VendorCreateArgs>(args: Prisma.SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VendorCreateManyArgs>(args?: Prisma.SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VendorDeleteArgs>(args: Prisma.SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VendorUpdateArgs>(args: Prisma.SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VendorDeleteManyArgs>(args?: Prisma.SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VendorUpdateManyArgs>(args: Prisma.SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VendorUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VendorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VendorUpsertArgs>(args: Prisma.SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma.Prisma__VendorClient<runtime.Types.Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VendorCountArgs>(args?: Prisma.Subset<T, VendorCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VendorCountAggregateOutputType> : number>;
    aggregate<T extends VendorAggregateArgs>(args: Prisma.Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>;
    groupBy<T extends VendorGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VendorGroupByArgs['orderBy'];
    } : {
        orderBy?: VendorGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VendorFieldRefs;
}
export interface Prisma__VendorClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    suppliedBikes<T extends Prisma.Vendor$suppliedBikesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vendor$suppliedBikesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    staff<T extends Prisma.Vendor$staffArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vendor$staffArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    purchaseOrders<T extends Prisma.Vendor$purchaseOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vendor$purchaseOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.Vendor$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vendor$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    allocations<T extends Prisma.Vendor$allocationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Vendor$allocationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VendorFieldRefs {
    readonly id: Prisma.FieldRef<"Vendor", 'String'>;
    readonly name: Prisma.FieldRef<"Vendor", 'String'>;
    readonly contactPerson: Prisma.FieldRef<"Vendor", 'String'>;
    readonly phoneNumber: Prisma.FieldRef<"Vendor", 'String'>;
    readonly email: Prisma.FieldRef<"Vendor", 'String'>;
    readonly address: Prisma.FieldRef<"Vendor", 'String'>;
    readonly isActive: Prisma.FieldRef<"Vendor", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Vendor", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Vendor", 'DateTime'>;
}
export type VendorFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorScalarFieldEnum | Prisma.VendorScalarFieldEnum[];
};
export type VendorFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorScalarFieldEnum | Prisma.VendorScalarFieldEnum[];
};
export type VendorFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[];
    cursor?: Prisma.VendorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorScalarFieldEnum | Prisma.VendorScalarFieldEnum[];
};
export type VendorCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorCreateInput, Prisma.VendorUncheckedCreateInput>;
};
export type VendorCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VendorCreateManyInput | Prisma.VendorCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    data: Prisma.VendorCreateManyInput | Prisma.VendorCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VendorUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorUpdateInput, Prisma.VendorUncheckedUpdateInput>;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VendorUpdateManyMutationInput, Prisma.VendorUncheckedUpdateManyInput>;
    where?: Prisma.VendorWhereInput;
    limit?: number;
};
export type VendorUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VendorUpdateManyMutationInput, Prisma.VendorUncheckedUpdateManyInput>;
    where?: Prisma.VendorWhereInput;
    limit?: number;
};
export type VendorUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
    create: Prisma.XOR<Prisma.VendorCreateInput, Prisma.VendorUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VendorUpdateInput, Prisma.VendorUncheckedUpdateInput>;
};
export type VendorDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
    where: Prisma.VendorWhereUniqueInput;
};
export type VendorDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorWhereInput;
    limit?: number;
};
export type Vendor$suppliedBikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Vendor$staffArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type Vendor$purchaseOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseOrderSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseOrderOmit<ExtArgs> | null;
    include?: Prisma.PurchaseOrderInclude<ExtArgs> | null;
    where?: Prisma.PurchaseOrderWhereInput;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput | Prisma.PurchaseOrderOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseOrderScalarFieldEnum | Prisma.PurchaseOrderScalarFieldEnum[];
};
export type Vendor$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Vendor$allocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VendorDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorSelect<ExtArgs> | null;
    omit?: Prisma.VendorOmit<ExtArgs> | null;
    include?: Prisma.VendorInclude<ExtArgs> | null;
};
