import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type ReceivablePartyModel = runtime.Types.Result.DefaultSelection<Prisma.$ReceivablePartyPayload>;
export type AggregateReceivableParty = {
    _count: ReceivablePartyCountAggregateOutputType | null;
    _min: ReceivablePartyMinAggregateOutputType | null;
    _max: ReceivablePartyMaxAggregateOutputType | null;
};
export type ReceivablePartyMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    partyType: $Enums.ReceivablePartyType | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean | null;
    customerPhone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReceivablePartyMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    partyType: $Enums.ReceivablePartyType | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean | null;
    customerPhone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReceivablePartyCountAggregateOutputType = {
    id: number;
    name: number;
    partyType: number;
    phone: number;
    email: number;
    address: number;
    notes: number;
    isActive: number;
    customerPhone: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ReceivablePartyMinAggregateInputType = {
    id?: true;
    name?: true;
    partyType?: true;
    phone?: true;
    email?: true;
    address?: true;
    notes?: true;
    isActive?: true;
    customerPhone?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReceivablePartyMaxAggregateInputType = {
    id?: true;
    name?: true;
    partyType?: true;
    phone?: true;
    email?: true;
    address?: true;
    notes?: true;
    isActive?: true;
    customerPhone?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReceivablePartyCountAggregateInputType = {
    id?: true;
    name?: true;
    partyType?: true;
    phone?: true;
    email?: true;
    address?: true;
    notes?: true;
    isActive?: true;
    customerPhone?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ReceivablePartyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePartyWhereInput;
    orderBy?: Prisma.ReceivablePartyOrderByWithRelationInput | Prisma.ReceivablePartyOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePartyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReceivablePartyCountAggregateInputType;
    _min?: ReceivablePartyMinAggregateInputType;
    _max?: ReceivablePartyMaxAggregateInputType;
};
export type GetReceivablePartyAggregateType<T extends ReceivablePartyAggregateArgs> = {
    [P in keyof T & keyof AggregateReceivableParty]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReceivableParty[P]> : Prisma.GetScalarType<T[P], AggregateReceivableParty[P]>;
};
export type ReceivablePartyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePartyWhereInput;
    orderBy?: Prisma.ReceivablePartyOrderByWithAggregationInput | Prisma.ReceivablePartyOrderByWithAggregationInput[];
    by: Prisma.ReceivablePartyScalarFieldEnum[] | Prisma.ReceivablePartyScalarFieldEnum;
    having?: Prisma.ReceivablePartyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReceivablePartyCountAggregateInputType | true;
    _min?: ReceivablePartyMinAggregateInputType;
    _max?: ReceivablePartyMaxAggregateInputType;
};
export type ReceivablePartyGroupByOutputType = {
    id: string;
    name: string;
    partyType: $Enums.ReceivablePartyType;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean;
    customerPhone: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ReceivablePartyCountAggregateOutputType | null;
    _min: ReceivablePartyMinAggregateOutputType | null;
    _max: ReceivablePartyMaxAggregateOutputType | null;
};
export type GetReceivablePartyGroupByPayload<T extends ReceivablePartyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReceivablePartyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReceivablePartyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReceivablePartyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReceivablePartyGroupByOutputType[P]>;
}>>;
export type ReceivablePartyWhereInput = {
    AND?: Prisma.ReceivablePartyWhereInput | Prisma.ReceivablePartyWhereInput[];
    OR?: Prisma.ReceivablePartyWhereInput[];
    NOT?: Prisma.ReceivablePartyWhereInput | Prisma.ReceivablePartyWhereInput[];
    id?: Prisma.StringFilter<"ReceivableParty"> | string;
    name?: Prisma.StringFilter<"ReceivableParty"> | string;
    partyType?: Prisma.EnumReceivablePartyTypeFilter<"ReceivableParty"> | $Enums.ReceivablePartyType;
    phone?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    email?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    address?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    notes?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    isActive?: Prisma.BoolFilter<"ReceivableParty"> | boolean;
    customerPhone?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ReceivableParty"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivableParty"> | Date | string;
    entries?: Prisma.ReceivableEntryListRelationFilter;
};
export type ReceivablePartyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    partyType?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    entries?: Prisma.ReceivableEntryOrderByRelationAggregateInput;
};
export type ReceivablePartyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    customerPhone?: string;
    AND?: Prisma.ReceivablePartyWhereInput | Prisma.ReceivablePartyWhereInput[];
    OR?: Prisma.ReceivablePartyWhereInput[];
    NOT?: Prisma.ReceivablePartyWhereInput | Prisma.ReceivablePartyWhereInput[];
    name?: Prisma.StringFilter<"ReceivableParty"> | string;
    partyType?: Prisma.EnumReceivablePartyTypeFilter<"ReceivableParty"> | $Enums.ReceivablePartyType;
    phone?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    email?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    address?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    notes?: Prisma.StringNullableFilter<"ReceivableParty"> | string | null;
    isActive?: Prisma.BoolFilter<"ReceivableParty"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"ReceivableParty"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivableParty"> | Date | string;
    entries?: Prisma.ReceivableEntryListRelationFilter;
}, "id" | "customerPhone">;
export type ReceivablePartyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    partyType?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ReceivablePartyCountOrderByAggregateInput;
    _max?: Prisma.ReceivablePartyMaxOrderByAggregateInput;
    _min?: Prisma.ReceivablePartyMinOrderByAggregateInput;
};
export type ReceivablePartyScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReceivablePartyScalarWhereWithAggregatesInput | Prisma.ReceivablePartyScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReceivablePartyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReceivablePartyScalarWhereWithAggregatesInput | Prisma.ReceivablePartyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ReceivableParty"> | string;
    name?: Prisma.StringWithAggregatesFilter<"ReceivableParty"> | string;
    partyType?: Prisma.EnumReceivablePartyTypeWithAggregatesFilter<"ReceivableParty"> | $Enums.ReceivablePartyType;
    phone?: Prisma.StringNullableWithAggregatesFilter<"ReceivableParty"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"ReceivableParty"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"ReceivableParty"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"ReceivableParty"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"ReceivableParty"> | boolean;
    customerPhone?: Prisma.StringNullableWithAggregatesFilter<"ReceivableParty"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivableParty"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivableParty"> | Date | string;
};
export type ReceivablePartyCreateInput = {
    id?: string;
    name: string;
    partyType?: $Enums.ReceivablePartyType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    customerPhone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    entries?: Prisma.ReceivableEntryCreateNestedManyWithoutPartyInput;
};
export type ReceivablePartyUncheckedCreateInput = {
    id?: string;
    name: string;
    partyType?: $Enums.ReceivablePartyType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    customerPhone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    entries?: Prisma.ReceivableEntryUncheckedCreateNestedManyWithoutPartyInput;
};
export type ReceivablePartyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    partyType?: Prisma.EnumReceivablePartyTypeFieldUpdateOperationsInput | $Enums.ReceivablePartyType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entries?: Prisma.ReceivableEntryUpdateManyWithoutPartyNestedInput;
};
export type ReceivablePartyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    partyType?: Prisma.EnumReceivablePartyTypeFieldUpdateOperationsInput | $Enums.ReceivablePartyType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entries?: Prisma.ReceivableEntryUncheckedUpdateManyWithoutPartyNestedInput;
};
export type ReceivablePartyCreateManyInput = {
    id?: string;
    name: string;
    partyType?: $Enums.ReceivablePartyType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    customerPhone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivablePartyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    partyType?: Prisma.EnumReceivablePartyTypeFieldUpdateOperationsInput | $Enums.ReceivablePartyType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePartyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    partyType?: Prisma.EnumReceivablePartyTypeFieldUpdateOperationsInput | $Enums.ReceivablePartyType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePartyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    partyType?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablePartyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    partyType?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablePartyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    partyType?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablePartyScalarRelationFilter = {
    is?: Prisma.ReceivablePartyWhereInput;
    isNot?: Prisma.ReceivablePartyWhereInput;
};
export type EnumReceivablePartyTypeFieldUpdateOperationsInput = {
    set?: $Enums.ReceivablePartyType;
};
export type ReceivablePartyCreateNestedOneWithoutEntriesInput = {
    create?: Prisma.XOR<Prisma.ReceivablePartyCreateWithoutEntriesInput, Prisma.ReceivablePartyUncheckedCreateWithoutEntriesInput>;
    connectOrCreate?: Prisma.ReceivablePartyCreateOrConnectWithoutEntriesInput;
    connect?: Prisma.ReceivablePartyWhereUniqueInput;
};
export type ReceivablePartyUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: Prisma.XOR<Prisma.ReceivablePartyCreateWithoutEntriesInput, Prisma.ReceivablePartyUncheckedCreateWithoutEntriesInput>;
    connectOrCreate?: Prisma.ReceivablePartyCreateOrConnectWithoutEntriesInput;
    upsert?: Prisma.ReceivablePartyUpsertWithoutEntriesInput;
    connect?: Prisma.ReceivablePartyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReceivablePartyUpdateToOneWithWhereWithoutEntriesInput, Prisma.ReceivablePartyUpdateWithoutEntriesInput>, Prisma.ReceivablePartyUncheckedUpdateWithoutEntriesInput>;
};
export type ReceivablePartyCreateWithoutEntriesInput = {
    id?: string;
    name: string;
    partyType?: $Enums.ReceivablePartyType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    customerPhone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivablePartyUncheckedCreateWithoutEntriesInput = {
    id?: string;
    name: string;
    partyType?: $Enums.ReceivablePartyType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    customerPhone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivablePartyCreateOrConnectWithoutEntriesInput = {
    where: Prisma.ReceivablePartyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePartyCreateWithoutEntriesInput, Prisma.ReceivablePartyUncheckedCreateWithoutEntriesInput>;
};
export type ReceivablePartyUpsertWithoutEntriesInput = {
    update: Prisma.XOR<Prisma.ReceivablePartyUpdateWithoutEntriesInput, Prisma.ReceivablePartyUncheckedUpdateWithoutEntriesInput>;
    create: Prisma.XOR<Prisma.ReceivablePartyCreateWithoutEntriesInput, Prisma.ReceivablePartyUncheckedCreateWithoutEntriesInput>;
    where?: Prisma.ReceivablePartyWhereInput;
};
export type ReceivablePartyUpdateToOneWithWhereWithoutEntriesInput = {
    where?: Prisma.ReceivablePartyWhereInput;
    data: Prisma.XOR<Prisma.ReceivablePartyUpdateWithoutEntriesInput, Prisma.ReceivablePartyUncheckedUpdateWithoutEntriesInput>;
};
export type ReceivablePartyUpdateWithoutEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    partyType?: Prisma.EnumReceivablePartyTypeFieldUpdateOperationsInput | $Enums.ReceivablePartyType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePartyUncheckedUpdateWithoutEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    partyType?: Prisma.EnumReceivablePartyTypeFieldUpdateOperationsInput | $Enums.ReceivablePartyType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablePartyCountOutputType = {
    entries: number;
};
export type ReceivablePartyCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entries?: boolean | ReceivablePartyCountOutputTypeCountEntriesArgs;
};
export type ReceivablePartyCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartyCountOutputTypeSelect<ExtArgs> | null;
};
export type ReceivablePartyCountOutputTypeCountEntriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivableEntryWhereInput;
};
export type ReceivablePartySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    partyType?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    customerPhone?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    entries?: boolean | Prisma.ReceivableParty$entriesArgs<ExtArgs>;
    _count?: boolean | Prisma.ReceivablePartyCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["receivableParty"]>;
export type ReceivablePartySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    partyType?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    customerPhone?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["receivableParty"]>;
export type ReceivablePartySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    partyType?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    customerPhone?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["receivableParty"]>;
export type ReceivablePartySelectScalar = {
    id?: boolean;
    name?: boolean;
    partyType?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    customerPhone?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ReceivablePartyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "partyType" | "phone" | "email" | "address" | "notes" | "isActive" | "customerPhone" | "createdAt" | "updatedAt", ExtArgs["result"]["receivableParty"]>;
export type ReceivablePartyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entries?: boolean | Prisma.ReceivableParty$entriesArgs<ExtArgs>;
    _count?: boolean | Prisma.ReceivablePartyCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ReceivablePartyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ReceivablePartyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ReceivablePartyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReceivableParty";
    objects: {
        entries: Prisma.$ReceivableEntryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        partyType: $Enums.ReceivablePartyType;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        isActive: boolean;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["receivableParty"]>;
    composites: {};
};
export type ReceivablePartyGetPayload<S extends boolean | null | undefined | ReceivablePartyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload, S>;
export type ReceivablePartyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReceivablePartyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReceivablePartyCountAggregateInputType | true;
};
export interface ReceivablePartyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReceivableParty'];
        meta: {
            name: 'ReceivableParty';
        };
    };
    findUnique<T extends ReceivablePartyFindUniqueArgs>(args: Prisma.SelectSubset<T, ReceivablePartyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReceivablePartyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReceivablePartyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReceivablePartyFindFirstArgs>(args?: Prisma.SelectSubset<T, ReceivablePartyFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReceivablePartyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReceivablePartyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReceivablePartyFindManyArgs>(args?: Prisma.SelectSubset<T, ReceivablePartyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReceivablePartyCreateArgs>(args: Prisma.SelectSubset<T, ReceivablePartyCreateArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReceivablePartyCreateManyArgs>(args?: Prisma.SelectSubset<T, ReceivablePartyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReceivablePartyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReceivablePartyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReceivablePartyDeleteArgs>(args: Prisma.SelectSubset<T, ReceivablePartyDeleteArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReceivablePartyUpdateArgs>(args: Prisma.SelectSubset<T, ReceivablePartyUpdateArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReceivablePartyDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReceivablePartyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReceivablePartyUpdateManyArgs>(args: Prisma.SelectSubset<T, ReceivablePartyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReceivablePartyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReceivablePartyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReceivablePartyUpsertArgs>(args: Prisma.SelectSubset<T, ReceivablePartyUpsertArgs<ExtArgs>>): Prisma.Prisma__ReceivablePartyClient<runtime.Types.Result.GetResult<Prisma.$ReceivablePartyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReceivablePartyCountArgs>(args?: Prisma.Subset<T, ReceivablePartyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReceivablePartyCountAggregateOutputType> : number>;
    aggregate<T extends ReceivablePartyAggregateArgs>(args: Prisma.Subset<T, ReceivablePartyAggregateArgs>): Prisma.PrismaPromise<GetReceivablePartyAggregateType<T>>;
    groupBy<T extends ReceivablePartyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReceivablePartyGroupByArgs['orderBy'];
    } : {
        orderBy?: ReceivablePartyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReceivablePartyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceivablePartyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReceivablePartyFieldRefs;
}
export interface Prisma__ReceivablePartyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    entries<T extends Prisma.ReceivableParty$entriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReceivableParty$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivableEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReceivablePartyFieldRefs {
    readonly id: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly name: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly partyType: Prisma.FieldRef<"ReceivableParty", 'ReceivablePartyType'>;
    readonly phone: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly email: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly address: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly notes: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly isActive: Prisma.FieldRef<"ReceivableParty", 'Boolean'>;
    readonly customerPhone: Prisma.FieldRef<"ReceivableParty", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ReceivableParty", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ReceivableParty", 'DateTime'>;
}
export type ReceivablePartyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where: Prisma.ReceivablePartyWhereUniqueInput;
};
export type ReceivablePartyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where: Prisma.ReceivablePartyWhereUniqueInput;
};
export type ReceivablePartyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePartyWhereInput;
    orderBy?: Prisma.ReceivablePartyOrderByWithRelationInput | Prisma.ReceivablePartyOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePartyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePartyScalarFieldEnum | Prisma.ReceivablePartyScalarFieldEnum[];
};
export type ReceivablePartyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePartyWhereInput;
    orderBy?: Prisma.ReceivablePartyOrderByWithRelationInput | Prisma.ReceivablePartyOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePartyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePartyScalarFieldEnum | Prisma.ReceivablePartyScalarFieldEnum[];
};
export type ReceivablePartyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePartyWhereInput;
    orderBy?: Prisma.ReceivablePartyOrderByWithRelationInput | Prisma.ReceivablePartyOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePartyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePartyScalarFieldEnum | Prisma.ReceivablePartyScalarFieldEnum[];
};
export type ReceivablePartyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablePartyCreateInput, Prisma.ReceivablePartyUncheckedCreateInput>;
};
export type ReceivablePartyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReceivablePartyCreateManyInput | Prisma.ReceivablePartyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceivablePartyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    data: Prisma.ReceivablePartyCreateManyInput | Prisma.ReceivablePartyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceivablePartyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablePartyUpdateInput, Prisma.ReceivablePartyUncheckedUpdateInput>;
    where: Prisma.ReceivablePartyWhereUniqueInput;
};
export type ReceivablePartyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReceivablePartyUpdateManyMutationInput, Prisma.ReceivablePartyUncheckedUpdateManyInput>;
    where?: Prisma.ReceivablePartyWhereInput;
    limit?: number;
};
export type ReceivablePartyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablePartyUpdateManyMutationInput, Prisma.ReceivablePartyUncheckedUpdateManyInput>;
    where?: Prisma.ReceivablePartyWhereInput;
    limit?: number;
};
export type ReceivablePartyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where: Prisma.ReceivablePartyWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablePartyCreateInput, Prisma.ReceivablePartyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReceivablePartyUpdateInput, Prisma.ReceivablePartyUncheckedUpdateInput>;
};
export type ReceivablePartyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
    where: Prisma.ReceivablePartyWhereUniqueInput;
};
export type ReceivablePartyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePartyWhereInput;
    limit?: number;
};
export type ReceivableParty$entriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReceivablePartyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePartySelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePartyOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePartyInclude<ExtArgs> | null;
};
