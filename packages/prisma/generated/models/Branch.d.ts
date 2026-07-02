import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type BranchModel = runtime.Types.Result.DefaultSelection<Prisma.$BranchPayload>;
export type AggregateBranch = {
    _count: BranchCountAggregateOutputType | null;
    _avg: BranchAvgAggregateOutputType | null;
    _sum: BranchSumAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type BranchAvgAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
};
export type BranchSumAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
};
export type BranchMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    city: string | null;
    address: string | null;
    phoneNumber: string | null;
    latitude: number | null;
    longitude: number | null;
    managerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BranchMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    city: string | null;
    address: string | null;
    phoneNumber: string | null;
    latitude: number | null;
    longitude: number | null;
    managerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BranchCountAggregateOutputType = {
    id: number;
    name: number;
    city: number;
    address: number;
    phoneNumber: number;
    latitude: number;
    longitude: number;
    managerId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BranchAvgAggregateInputType = {
    latitude?: true;
    longitude?: true;
};
export type BranchSumAggregateInputType = {
    latitude?: true;
    longitude?: true;
};
export type BranchMinAggregateInputType = {
    id?: true;
    name?: true;
    city?: true;
    address?: true;
    phoneNumber?: true;
    latitude?: true;
    longitude?: true;
    managerId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BranchMaxAggregateInputType = {
    id?: true;
    name?: true;
    city?: true;
    address?: true;
    phoneNumber?: true;
    latitude?: true;
    longitude?: true;
    managerId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BranchCountAggregateInputType = {
    id?: true;
    name?: true;
    city?: true;
    address?: true;
    phoneNumber?: true;
    latitude?: true;
    longitude?: true;
    managerId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BranchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BranchCountAggregateInputType;
    _avg?: BranchAvgAggregateInputType;
    _sum?: BranchSumAggregateInputType;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type GetBranchAggregateType<T extends BranchAggregateArgs> = {
    [P in keyof T & keyof AggregateBranch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBranch[P]> : Prisma.GetScalarType<T[P], AggregateBranch[P]>;
};
export type BranchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithAggregationInput | Prisma.BranchOrderByWithAggregationInput[];
    by: Prisma.BranchScalarFieldEnum[] | Prisma.BranchScalarFieldEnum;
    having?: Prisma.BranchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BranchCountAggregateInputType | true;
    _avg?: BranchAvgAggregateInputType;
    _sum?: BranchSumAggregateInputType;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type BranchGroupByOutputType = {
    id: string;
    name: string;
    city: string;
    address: string;
    phoneNumber: string | null;
    latitude: number | null;
    longitude: number | null;
    managerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BranchCountAggregateOutputType | null;
    _avg: BranchAvgAggregateOutputType | null;
    _sum: BranchSumAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type GetBranchGroupByPayload<T extends BranchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BranchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BranchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]>;
}>>;
export type BranchWhereInput = {
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    id?: Prisma.StringFilter<"Branch"> | string;
    name?: Prisma.StringFilter<"Branch"> | string;
    city?: Prisma.StringFilter<"Branch"> | string;
    address?: Prisma.StringFilter<"Branch"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"Branch"> | string | null;
    latitude?: Prisma.FloatNullableFilter<"Branch"> | number | null;
    longitude?: Prisma.FloatNullableFilter<"Branch"> | number | null;
    managerId?: Prisma.StringNullableFilter<"Branch"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    manager?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    users?: Prisma.UserListRelationFilter;
    bikeInventory?: Prisma.BikeUnitListRelationFilter;
    partInventory?: Prisma.PartInventoryListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
    partOrders?: Prisma.PartOrderListRelationFilter;
    expenses?: Prisma.ExpenseListRelationFilter;
    allocationPartLines?: Prisma.VendorAllocationPartLineListRelationFilter;
};
export type BranchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    latitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    longitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    managerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    manager?: Prisma.UserOrderByWithRelationInput;
    users?: Prisma.UserOrderByRelationAggregateInput;
    bikeInventory?: Prisma.BikeUnitOrderByRelationAggregateInput;
    partInventory?: Prisma.PartInventoryOrderByRelationAggregateInput;
    orders?: Prisma.OrderOrderByRelationAggregateInput;
    partOrders?: Prisma.PartOrderOrderByRelationAggregateInput;
    expenses?: Prisma.ExpenseOrderByRelationAggregateInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineOrderByRelationAggregateInput;
};
export type BranchWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name_city?: Prisma.BranchNameCityCompoundUniqueInput;
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    name?: Prisma.StringFilter<"Branch"> | string;
    city?: Prisma.StringFilter<"Branch"> | string;
    address?: Prisma.StringFilter<"Branch"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"Branch"> | string | null;
    latitude?: Prisma.FloatNullableFilter<"Branch"> | number | null;
    longitude?: Prisma.FloatNullableFilter<"Branch"> | number | null;
    managerId?: Prisma.StringNullableFilter<"Branch"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    manager?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    users?: Prisma.UserListRelationFilter;
    bikeInventory?: Prisma.BikeUnitListRelationFilter;
    partInventory?: Prisma.PartInventoryListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
    partOrders?: Prisma.PartOrderListRelationFilter;
    expenses?: Prisma.ExpenseListRelationFilter;
    allocationPartLines?: Prisma.VendorAllocationPartLineListRelationFilter;
}, "id" | "name_city">;
export type BranchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    latitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    longitude?: Prisma.SortOrderInput | Prisma.SortOrder;
    managerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BranchCountOrderByAggregateInput;
    _avg?: Prisma.BranchAvgOrderByAggregateInput;
    _max?: Prisma.BranchMaxOrderByAggregateInput;
    _min?: Prisma.BranchMinOrderByAggregateInput;
    _sum?: Prisma.BranchSumOrderByAggregateInput;
};
export type BranchScalarWhereWithAggregatesInput = {
    AND?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    OR?: Prisma.BranchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    city?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    address?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    phoneNumber?: Prisma.StringNullableWithAggregatesFilter<"Branch"> | string | null;
    latitude?: Prisma.FloatNullableWithAggregatesFilter<"Branch"> | number | null;
    longitude?: Prisma.FloatNullableWithAggregatesFilter<"Branch"> | number | null;
    managerId?: Prisma.StringNullableWithAggregatesFilter<"Branch"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
};
export type BranchCreateInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateManyInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BranchUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchNullableScalarRelationFilter = {
    is?: Prisma.BranchWhereInput | null;
    isNot?: Prisma.BranchWhereInput | null;
};
export type BranchListRelationFilter = {
    every?: Prisma.BranchWhereInput;
    some?: Prisma.BranchWhereInput;
    none?: Prisma.BranchWhereInput;
};
export type BranchOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BranchNameCityCompoundUniqueInput = {
    name: string;
    city: string;
};
export type BranchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    managerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchAvgOrderByAggregateInput = {
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
};
export type BranchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    managerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    managerId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BranchSumOrderByAggregateInput = {
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
};
export type BranchScalarRelationFilter = {
    is?: Prisma.BranchWhereInput;
    isNot?: Prisma.BranchWhereInput;
};
export type BranchCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchCreateNestedManyWithoutManagerInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutManagerInput, Prisma.BranchUncheckedCreateWithoutManagerInput> | Prisma.BranchCreateWithoutManagerInput[] | Prisma.BranchUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutManagerInput | Prisma.BranchCreateOrConnectWithoutManagerInput[];
    createMany?: Prisma.BranchCreateManyManagerInputEnvelope;
    connect?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
};
export type BranchUncheckedCreateNestedManyWithoutManagerInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutManagerInput, Prisma.BranchUncheckedCreateWithoutManagerInput> | Prisma.BranchCreateWithoutManagerInput[] | Prisma.BranchUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutManagerInput | Prisma.BranchCreateOrConnectWithoutManagerInput[];
    createMany?: Prisma.BranchCreateManyManagerInputEnvelope;
    connect?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
};
export type BranchUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.BranchUpsertWithoutUsersInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutUsersInput, Prisma.BranchUpdateWithoutUsersInput>, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type BranchUpdateManyWithoutManagerNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutManagerInput, Prisma.BranchUncheckedCreateWithoutManagerInput> | Prisma.BranchCreateWithoutManagerInput[] | Prisma.BranchUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutManagerInput | Prisma.BranchCreateOrConnectWithoutManagerInput[];
    upsert?: Prisma.BranchUpsertWithWhereUniqueWithoutManagerInput | Prisma.BranchUpsertWithWhereUniqueWithoutManagerInput[];
    createMany?: Prisma.BranchCreateManyManagerInputEnvelope;
    set?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    disconnect?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    delete?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    connect?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    update?: Prisma.BranchUpdateWithWhereUniqueWithoutManagerInput | Prisma.BranchUpdateWithWhereUniqueWithoutManagerInput[];
    updateMany?: Prisma.BranchUpdateManyWithWhereWithoutManagerInput | Prisma.BranchUpdateManyWithWhereWithoutManagerInput[];
    deleteMany?: Prisma.BranchScalarWhereInput | Prisma.BranchScalarWhereInput[];
};
export type BranchUncheckedUpdateManyWithoutManagerNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutManagerInput, Prisma.BranchUncheckedCreateWithoutManagerInput> | Prisma.BranchCreateWithoutManagerInput[] | Prisma.BranchUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutManagerInput | Prisma.BranchCreateOrConnectWithoutManagerInput[];
    upsert?: Prisma.BranchUpsertWithWhereUniqueWithoutManagerInput | Prisma.BranchUpsertWithWhereUniqueWithoutManagerInput[];
    createMany?: Prisma.BranchCreateManyManagerInputEnvelope;
    set?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    disconnect?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    delete?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    connect?: Prisma.BranchWhereUniqueInput | Prisma.BranchWhereUniqueInput[];
    update?: Prisma.BranchUpdateWithWhereUniqueWithoutManagerInput | Prisma.BranchUpdateWithWhereUniqueWithoutManagerInput[];
    updateMany?: Prisma.BranchUpdateManyWithWhereWithoutManagerInput | Prisma.BranchUpdateManyWithWhereWithoutManagerInput[];
    deleteMany?: Prisma.BranchScalarWhereInput | Prisma.BranchScalarWhereInput[];
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BranchCreateNestedOneWithoutBikeInventoryInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutBikeInventoryInput, Prisma.BranchUncheckedCreateWithoutBikeInventoryInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutBikeInventoryInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutBikeInventoryNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutBikeInventoryInput, Prisma.BranchUncheckedCreateWithoutBikeInventoryInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutBikeInventoryInput;
    upsert?: Prisma.BranchUpsertWithoutBikeInventoryInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutBikeInventoryInput, Prisma.BranchUpdateWithoutBikeInventoryInput>, Prisma.BranchUncheckedUpdateWithoutBikeInventoryInput>;
};
export type BranchCreateNestedOneWithoutPartInventoryInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutPartInventoryInput, Prisma.BranchUncheckedCreateWithoutPartInventoryInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutPartInventoryInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutPartInventoryNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutPartInventoryInput, Prisma.BranchUncheckedCreateWithoutPartInventoryInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutPartInventoryInput;
    upsert?: Prisma.BranchUpsertWithoutPartInventoryInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutPartInventoryInput, Prisma.BranchUpdateWithoutPartInventoryInput>, Prisma.BranchUncheckedUpdateWithoutPartInventoryInput>;
};
export type BranchCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.BranchUpsertWithoutOrdersInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutOrdersInput, Prisma.BranchUpdateWithoutOrdersInput>, Prisma.BranchUncheckedUpdateWithoutOrdersInput>;
};
export type BranchCreateNestedOneWithoutPartOrdersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutPartOrdersInput, Prisma.BranchUncheckedCreateWithoutPartOrdersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutPartOrdersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutPartOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutPartOrdersInput, Prisma.BranchUncheckedCreateWithoutPartOrdersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutPartOrdersInput;
    upsert?: Prisma.BranchUpsertWithoutPartOrdersInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutPartOrdersInput, Prisma.BranchUpdateWithoutPartOrdersInput>, Prisma.BranchUncheckedUpdateWithoutPartOrdersInput>;
};
export type BranchCreateNestedOneWithoutExpensesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutExpensesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutExpensesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutExpensesInput;
    upsert?: Prisma.BranchUpsertWithoutExpensesInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutExpensesInput, Prisma.BranchUpdateWithoutExpensesInput>, Prisma.BranchUncheckedUpdateWithoutExpensesInput>;
};
export type BranchCreateNestedOneWithoutAllocationPartLinesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutAllocationPartLinesInput, Prisma.BranchUncheckedCreateWithoutAllocationPartLinesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutAllocationPartLinesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutAllocationPartLinesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutAllocationPartLinesInput, Prisma.BranchUncheckedCreateWithoutAllocationPartLinesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutAllocationPartLinesInput;
    upsert?: Prisma.BranchUpsertWithoutAllocationPartLinesInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutAllocationPartLinesInput, Prisma.BranchUpdateWithoutAllocationPartLinesInput>, Prisma.BranchUncheckedUpdateWithoutAllocationPartLinesInput>;
};
export type BranchCreateWithoutUsersInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutUsersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
};
export type BranchCreateWithoutManagerInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutManagerInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutManagerInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutManagerInput, Prisma.BranchUncheckedCreateWithoutManagerInput>;
};
export type BranchCreateManyManagerInputEnvelope = {
    data: Prisma.BranchCreateManyManagerInput | Prisma.BranchCreateManyManagerInput[];
    skipDuplicates?: boolean;
};
export type BranchUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type BranchUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchUpsertWithWhereUniqueWithoutManagerInput = {
    where: Prisma.BranchWhereUniqueInput;
    update: Prisma.XOR<Prisma.BranchUpdateWithoutManagerInput, Prisma.BranchUncheckedUpdateWithoutManagerInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutManagerInput, Prisma.BranchUncheckedCreateWithoutManagerInput>;
};
export type BranchUpdateWithWhereUniqueWithoutManagerInput = {
    where: Prisma.BranchWhereUniqueInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutManagerInput, Prisma.BranchUncheckedUpdateWithoutManagerInput>;
};
export type BranchUpdateManyWithWhereWithoutManagerInput = {
    where: Prisma.BranchScalarWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyWithoutManagerInput>;
};
export type BranchScalarWhereInput = {
    AND?: Prisma.BranchScalarWhereInput | Prisma.BranchScalarWhereInput[];
    OR?: Prisma.BranchScalarWhereInput[];
    NOT?: Prisma.BranchScalarWhereInput | Prisma.BranchScalarWhereInput[];
    id?: Prisma.StringFilter<"Branch"> | string;
    name?: Prisma.StringFilter<"Branch"> | string;
    city?: Prisma.StringFilter<"Branch"> | string;
    address?: Prisma.StringFilter<"Branch"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"Branch"> | string | null;
    latitude?: Prisma.FloatNullableFilter<"Branch"> | number | null;
    longitude?: Prisma.FloatNullableFilter<"Branch"> | number | null;
    managerId?: Prisma.StringNullableFilter<"Branch"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
};
export type BranchCreateWithoutBikeInventoryInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutBikeInventoryInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutBikeInventoryInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutBikeInventoryInput, Prisma.BranchUncheckedCreateWithoutBikeInventoryInput>;
};
export type BranchUpsertWithoutBikeInventoryInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutBikeInventoryInput, Prisma.BranchUncheckedUpdateWithoutBikeInventoryInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutBikeInventoryInput, Prisma.BranchUncheckedCreateWithoutBikeInventoryInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutBikeInventoryInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutBikeInventoryInput, Prisma.BranchUncheckedUpdateWithoutBikeInventoryInput>;
};
export type BranchUpdateWithoutBikeInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutBikeInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutPartInventoryInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutPartInventoryInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutPartInventoryInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutPartInventoryInput, Prisma.BranchUncheckedCreateWithoutPartInventoryInput>;
};
export type BranchUpsertWithoutPartInventoryInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutPartInventoryInput, Prisma.BranchUncheckedUpdateWithoutPartInventoryInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutPartInventoryInput, Prisma.BranchUncheckedCreateWithoutPartInventoryInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutPartInventoryInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutPartInventoryInput, Prisma.BranchUncheckedUpdateWithoutPartInventoryInput>;
};
export type BranchUpdateWithoutPartInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutPartInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutOrdersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
};
export type BranchUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutOrdersInput, Prisma.BranchUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutOrdersInput, Prisma.BranchUncheckedUpdateWithoutOrdersInput>;
};
export type BranchUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutPartOrdersInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutPartOrdersInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutPartOrdersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutPartOrdersInput, Prisma.BranchUncheckedCreateWithoutPartOrdersInput>;
};
export type BranchUpsertWithoutPartOrdersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutPartOrdersInput, Prisma.BranchUncheckedUpdateWithoutPartOrdersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutPartOrdersInput, Prisma.BranchUncheckedCreateWithoutPartOrdersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutPartOrdersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutPartOrdersInput, Prisma.BranchUncheckedUpdateWithoutPartOrdersInput>;
};
export type BranchUpdateWithoutPartOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutPartOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutExpensesInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutExpensesInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutExpensesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
};
export type BranchUpsertWithoutExpensesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutExpensesInput, Prisma.BranchUncheckedUpdateWithoutExpensesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutExpensesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutExpensesInput, Prisma.BranchUncheckedUpdateWithoutExpensesInput>;
};
export type BranchUpdateWithoutExpensesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutExpensesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutAllocationPartLinesInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutManagedBranchesInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutAllocationPartLinesInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    managerId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    bikeInventory?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutBranchInput;
    partInventory?: Prisma.PartInventoryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    partOrders?: Prisma.PartOrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutAllocationPartLinesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutAllocationPartLinesInput, Prisma.BranchUncheckedCreateWithoutAllocationPartLinesInput>;
};
export type BranchUpsertWithoutAllocationPartLinesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutAllocationPartLinesInput, Prisma.BranchUncheckedUpdateWithoutAllocationPartLinesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutAllocationPartLinesInput, Prisma.BranchUncheckedCreateWithoutAllocationPartLinesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutAllocationPartLinesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutAllocationPartLinesInput, Prisma.BranchUncheckedUpdateWithoutAllocationPartLinesInput>;
};
export type BranchUpdateWithoutAllocationPartLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutManagedBranchesNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutAllocationPartLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateManyManagerInput = {
    id?: string;
    name: string;
    city: string;
    address: string;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BranchUpdateWithoutManagerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutManagerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    bikeInventory?: Prisma.BikeUnitUncheckedUpdateManyWithoutBranchNestedInput;
    partInventory?: Prisma.PartInventoryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    partOrders?: Prisma.PartOrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    allocationPartLines?: Prisma.VendorAllocationPartLineUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateManyWithoutManagerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    latitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchCountOutputType = {
    users: number;
    bikeInventory: number;
    partInventory: number;
    orders: number;
    partOrders: number;
    expenses: number;
    allocationPartLines: number;
};
export type BranchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | BranchCountOutputTypeCountUsersArgs;
    bikeInventory?: boolean | BranchCountOutputTypeCountBikeInventoryArgs;
    partInventory?: boolean | BranchCountOutputTypeCountPartInventoryArgs;
    orders?: boolean | BranchCountOutputTypeCountOrdersArgs;
    partOrders?: boolean | BranchCountOutputTypeCountPartOrdersArgs;
    expenses?: boolean | BranchCountOutputTypeCountExpensesArgs;
    allocationPartLines?: boolean | BranchCountOutputTypeCountAllocationPartLinesArgs;
};
export type BranchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchCountOutputTypeSelect<ExtArgs> | null;
};
export type BranchCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type BranchCountOutputTypeCountBikeInventoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeUnitWhereInput;
};
export type BranchCountOutputTypeCountPartInventoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartInventoryWhereInput;
};
export type BranchCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
export type BranchCountOutputTypeCountPartOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartOrderWhereInput;
};
export type BranchCountOutputTypeCountExpensesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpenseWhereInput;
};
export type BranchCountOutputTypeCountAllocationPartLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorAllocationPartLineWhereInput;
};
export type BranchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    city?: boolean;
    address?: boolean;
    phoneNumber?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    managerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    manager?: boolean | Prisma.Branch$managerArgs<ExtArgs>;
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    bikeInventory?: boolean | Prisma.Branch$bikeInventoryArgs<ExtArgs>;
    partInventory?: boolean | Prisma.Branch$partInventoryArgs<ExtArgs>;
    orders?: boolean | Prisma.Branch$ordersArgs<ExtArgs>;
    partOrders?: boolean | Prisma.Branch$partOrdersArgs<ExtArgs>;
    expenses?: boolean | Prisma.Branch$expensesArgs<ExtArgs>;
    allocationPartLines?: boolean | Prisma.Branch$allocationPartLinesArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    city?: boolean;
    address?: boolean;
    phoneNumber?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    managerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    manager?: boolean | Prisma.Branch$managerArgs<ExtArgs>;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    city?: boolean;
    address?: boolean;
    phoneNumber?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    managerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    manager?: boolean | Prisma.Branch$managerArgs<ExtArgs>;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectScalar = {
    id?: boolean;
    name?: boolean;
    city?: boolean;
    address?: boolean;
    phoneNumber?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    managerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BranchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "city" | "address" | "phoneNumber" | "latitude" | "longitude" | "managerId" | "createdAt" | "updatedAt", ExtArgs["result"]["branch"]>;
export type BranchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    manager?: boolean | Prisma.Branch$managerArgs<ExtArgs>;
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    bikeInventory?: boolean | Prisma.Branch$bikeInventoryArgs<ExtArgs>;
    partInventory?: boolean | Prisma.Branch$partInventoryArgs<ExtArgs>;
    orders?: boolean | Prisma.Branch$ordersArgs<ExtArgs>;
    partOrders?: boolean | Prisma.Branch$partOrdersArgs<ExtArgs>;
    expenses?: boolean | Prisma.Branch$expensesArgs<ExtArgs>;
    allocationPartLines?: boolean | Prisma.Branch$allocationPartLinesArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BranchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    manager?: boolean | Prisma.Branch$managerArgs<ExtArgs>;
};
export type BranchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    manager?: boolean | Prisma.Branch$managerArgs<ExtArgs>;
};
export type $BranchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Branch";
    objects: {
        manager: Prisma.$UserPayload<ExtArgs> | null;
        users: Prisma.$UserPayload<ExtArgs>[];
        bikeInventory: Prisma.$BikeUnitPayload<ExtArgs>[];
        partInventory: Prisma.$PartInventoryPayload<ExtArgs>[];
        orders: Prisma.$OrderPayload<ExtArgs>[];
        partOrders: Prisma.$PartOrderPayload<ExtArgs>[];
        expenses: Prisma.$ExpensePayload<ExtArgs>[];
        allocationPartLines: Prisma.$VendorAllocationPartLinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        city: string;
        address: string;
        phoneNumber: string | null;
        latitude: number | null;
        longitude: number | null;
        managerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["branch"]>;
    composites: {};
};
export type BranchGetPayload<S extends boolean | null | undefined | BranchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BranchPayload, S>;
export type BranchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BranchCountAggregateInputType | true;
};
export interface BranchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Branch'];
        meta: {
            name: 'Branch';
        };
    };
    findUnique<T extends BranchFindUniqueArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BranchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BranchFindFirstArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BranchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BranchFindManyArgs>(args?: Prisma.SelectSubset<T, BranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BranchCreateArgs>(args: Prisma.SelectSubset<T, BranchCreateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BranchCreateManyArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BranchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BranchDeleteArgs>(args: Prisma.SelectSubset<T, BranchDeleteArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BranchUpdateArgs>(args: Prisma.SelectSubset<T, BranchUpdateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BranchDeleteManyArgs>(args?: Prisma.SelectSubset<T, BranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BranchUpdateManyArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BranchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BranchUpsertArgs>(args: Prisma.SelectSubset<T, BranchUpsertArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BranchCountArgs>(args?: Prisma.Subset<T, BranchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BranchCountAggregateOutputType> : number>;
    aggregate<T extends BranchAggregateArgs>(args: Prisma.Subset<T, BranchAggregateArgs>): Prisma.PrismaPromise<GetBranchAggregateType<T>>;
    groupBy<T extends BranchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BranchGroupByArgs['orderBy'];
    } : {
        orderBy?: BranchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BranchFieldRefs;
}
export interface Prisma__BranchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    manager<T extends Prisma.Branch$managerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$managerArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    users<T extends Prisma.Branch$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    bikeInventory<T extends Prisma.Branch$bikeInventoryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$bikeInventoryArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    partInventory<T extends Prisma.Branch$partInventoryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$partInventoryArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartInventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orders<T extends Prisma.Branch$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    partOrders<T extends Prisma.Branch$partOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$partOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    expenses<T extends Prisma.Branch$expensesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$expensesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    allocationPartLines<T extends Prisma.Branch$allocationPartLinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$allocationPartLinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorAllocationPartLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BranchFieldRefs {
    readonly id: Prisma.FieldRef<"Branch", 'String'>;
    readonly name: Prisma.FieldRef<"Branch", 'String'>;
    readonly city: Prisma.FieldRef<"Branch", 'String'>;
    readonly address: Prisma.FieldRef<"Branch", 'String'>;
    readonly phoneNumber: Prisma.FieldRef<"Branch", 'String'>;
    readonly latitude: Prisma.FieldRef<"Branch", 'Float'>;
    readonly longitude: Prisma.FieldRef<"Branch", 'Float'>;
    readonly managerId: Prisma.FieldRef<"Branch", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Branch", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Branch", 'DateTime'>;
}
export type BranchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
};
export type BranchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BranchIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BranchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type BranchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    where?: Prisma.BranchWhereInput;
    limit?: number;
    include?: Prisma.BranchIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BranchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
};
export type BranchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type Branch$managerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Branch$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Branch$bikeInventoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Branch$partInventoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartInventorySelect<ExtArgs> | null;
    omit?: Prisma.PartInventoryOmit<ExtArgs> | null;
    include?: Prisma.PartInventoryInclude<ExtArgs> | null;
    where?: Prisma.PartInventoryWhereInput;
    orderBy?: Prisma.PartInventoryOrderByWithRelationInput | Prisma.PartInventoryOrderByWithRelationInput[];
    cursor?: Prisma.PartInventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartInventoryScalarFieldEnum | Prisma.PartInventoryScalarFieldEnum[];
};
export type Branch$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
export type Branch$partOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PartOrderSelect<ExtArgs> | null;
    omit?: Prisma.PartOrderOmit<ExtArgs> | null;
    include?: Prisma.PartOrderInclude<ExtArgs> | null;
    where?: Prisma.PartOrderWhereInput;
    orderBy?: Prisma.PartOrderOrderByWithRelationInput | Prisma.PartOrderOrderByWithRelationInput[];
    cursor?: Prisma.PartOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PartOrderScalarFieldEnum | Prisma.PartOrderScalarFieldEnum[];
};
export type Branch$expensesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    where?: Prisma.ExpenseWhereInput;
    orderBy?: Prisma.ExpenseOrderByWithRelationInput | Prisma.ExpenseOrderByWithRelationInput[];
    cursor?: Prisma.ExpenseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExpenseScalarFieldEnum | Prisma.ExpenseScalarFieldEnum[];
};
export type Branch$allocationPartLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VendorAllocationPartLineSelect<ExtArgs> | null;
    omit?: Prisma.VendorAllocationPartLineOmit<ExtArgs> | null;
    include?: Prisma.VendorAllocationPartLineInclude<ExtArgs> | null;
    where?: Prisma.VendorAllocationPartLineWhereInput;
    orderBy?: Prisma.VendorAllocationPartLineOrderByWithRelationInput | Prisma.VendorAllocationPartLineOrderByWithRelationInput[];
    cursor?: Prisma.VendorAllocationPartLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VendorAllocationPartLineScalarFieldEnum | Prisma.VendorAllocationPartLineScalarFieldEnum[];
};
export type BranchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
};
