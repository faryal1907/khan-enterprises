import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type PayeeAccountModel = runtime.Types.Result.DefaultSelection<Prisma.$PayeeAccountPayload>;
export type AggregatePayeeAccount = {
    _count: PayeeAccountCountAggregateOutputType | null;
    _min: PayeeAccountMinAggregateOutputType | null;
    _max: PayeeAccountMaxAggregateOutputType | null;
};
export type PayeeAccountMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: $Enums.PayeeType | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PayeeAccountMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: $Enums.PayeeType | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PayeeAccountCountAggregateOutputType = {
    id: number;
    name: number;
    type: number;
    phone: number;
    email: number;
    address: number;
    notes: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PayeeAccountMinAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    phone?: true;
    email?: true;
    address?: true;
    notes?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PayeeAccountMaxAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    phone?: true;
    email?: true;
    address?: true;
    notes?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PayeeAccountCountAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    phone?: true;
    email?: true;
    address?: true;
    notes?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PayeeAccountAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PayeeAccountWhereInput;
    orderBy?: Prisma.PayeeAccountOrderByWithRelationInput | Prisma.PayeeAccountOrderByWithRelationInput[];
    cursor?: Prisma.PayeeAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PayeeAccountCountAggregateInputType;
    _min?: PayeeAccountMinAggregateInputType;
    _max?: PayeeAccountMaxAggregateInputType;
};
export type GetPayeeAccountAggregateType<T extends PayeeAccountAggregateArgs> = {
    [P in keyof T & keyof AggregatePayeeAccount]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePayeeAccount[P]> : Prisma.GetScalarType<T[P], AggregatePayeeAccount[P]>;
};
export type PayeeAccountGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PayeeAccountWhereInput;
    orderBy?: Prisma.PayeeAccountOrderByWithAggregationInput | Prisma.PayeeAccountOrderByWithAggregationInput[];
    by: Prisma.PayeeAccountScalarFieldEnum[] | Prisma.PayeeAccountScalarFieldEnum;
    having?: Prisma.PayeeAccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PayeeAccountCountAggregateInputType | true;
    _min?: PayeeAccountMinAggregateInputType;
    _max?: PayeeAccountMaxAggregateInputType;
};
export type PayeeAccountGroupByOutputType = {
    id: string;
    name: string;
    type: $Enums.PayeeType;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: PayeeAccountCountAggregateOutputType | null;
    _min: PayeeAccountMinAggregateOutputType | null;
    _max: PayeeAccountMaxAggregateOutputType | null;
};
export type GetPayeeAccountGroupByPayload<T extends PayeeAccountGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PayeeAccountGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PayeeAccountGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PayeeAccountGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PayeeAccountGroupByOutputType[P]>;
}>>;
export type PayeeAccountWhereInput = {
    AND?: Prisma.PayeeAccountWhereInput | Prisma.PayeeAccountWhereInput[];
    OR?: Prisma.PayeeAccountWhereInput[];
    NOT?: Prisma.PayeeAccountWhereInput | Prisma.PayeeAccountWhereInput[];
    id?: Prisma.StringFilter<"PayeeAccount"> | string;
    name?: Prisma.StringFilter<"PayeeAccount"> | string;
    type?: Prisma.EnumPayeeTypeFilter<"PayeeAccount"> | $Enums.PayeeType;
    phone?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    email?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    address?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    notes?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    isActive?: Prisma.BoolFilter<"PayeeAccount"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"PayeeAccount"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PayeeAccount"> | Date | string;
    expenses?: Prisma.ExpenseListRelationFilter;
};
export type PayeeAccountOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    expenses?: Prisma.ExpenseOrderByRelationAggregateInput;
};
export type PayeeAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PayeeAccountWhereInput | Prisma.PayeeAccountWhereInput[];
    OR?: Prisma.PayeeAccountWhereInput[];
    NOT?: Prisma.PayeeAccountWhereInput | Prisma.PayeeAccountWhereInput[];
    name?: Prisma.StringFilter<"PayeeAccount"> | string;
    type?: Prisma.EnumPayeeTypeFilter<"PayeeAccount"> | $Enums.PayeeType;
    phone?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    email?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    address?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    notes?: Prisma.StringNullableFilter<"PayeeAccount"> | string | null;
    isActive?: Prisma.BoolFilter<"PayeeAccount"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"PayeeAccount"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PayeeAccount"> | Date | string;
    expenses?: Prisma.ExpenseListRelationFilter;
}, "id">;
export type PayeeAccountOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PayeeAccountCountOrderByAggregateInput;
    _max?: Prisma.PayeeAccountMaxOrderByAggregateInput;
    _min?: Prisma.PayeeAccountMinOrderByAggregateInput;
};
export type PayeeAccountScalarWhereWithAggregatesInput = {
    AND?: Prisma.PayeeAccountScalarWhereWithAggregatesInput | Prisma.PayeeAccountScalarWhereWithAggregatesInput[];
    OR?: Prisma.PayeeAccountScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PayeeAccountScalarWhereWithAggregatesInput | Prisma.PayeeAccountScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PayeeAccount"> | string;
    name?: Prisma.StringWithAggregatesFilter<"PayeeAccount"> | string;
    type?: Prisma.EnumPayeeTypeWithAggregatesFilter<"PayeeAccount"> | $Enums.PayeeType;
    phone?: Prisma.StringNullableWithAggregatesFilter<"PayeeAccount"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"PayeeAccount"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"PayeeAccount"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"PayeeAccount"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"PayeeAccount"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PayeeAccount"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PayeeAccount"> | Date | string;
};
export type PayeeAccountCreateInput = {
    id?: string;
    name: string;
    type?: $Enums.PayeeType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutPayeeAccountInput;
};
export type PayeeAccountUncheckedCreateInput = {
    id?: string;
    name: string;
    type?: $Enums.PayeeType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutPayeeAccountInput;
};
export type PayeeAccountUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayeeTypeFieldUpdateOperationsInput | $Enums.PayeeType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expenses?: Prisma.ExpenseUpdateManyWithoutPayeeAccountNestedInput;
};
export type PayeeAccountUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayeeTypeFieldUpdateOperationsInput | $Enums.PayeeType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutPayeeAccountNestedInput;
};
export type PayeeAccountCreateManyInput = {
    id?: string;
    name: string;
    type?: $Enums.PayeeType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PayeeAccountUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayeeTypeFieldUpdateOperationsInput | $Enums.PayeeType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PayeeAccountUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayeeTypeFieldUpdateOperationsInput | $Enums.PayeeType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PayeeAccountCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PayeeAccountMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PayeeAccountMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PayeeAccountNullableScalarRelationFilter = {
    is?: Prisma.PayeeAccountWhereInput | null;
    isNot?: Prisma.PayeeAccountWhereInput | null;
};
export type EnumPayeeTypeFieldUpdateOperationsInput = {
    set?: $Enums.PayeeType;
};
export type PayeeAccountCreateNestedOneWithoutExpensesInput = {
    create?: Prisma.XOR<Prisma.PayeeAccountCreateWithoutExpensesInput, Prisma.PayeeAccountUncheckedCreateWithoutExpensesInput>;
    connectOrCreate?: Prisma.PayeeAccountCreateOrConnectWithoutExpensesInput;
    connect?: Prisma.PayeeAccountWhereUniqueInput;
};
export type PayeeAccountUpdateOneWithoutExpensesNestedInput = {
    create?: Prisma.XOR<Prisma.PayeeAccountCreateWithoutExpensesInput, Prisma.PayeeAccountUncheckedCreateWithoutExpensesInput>;
    connectOrCreate?: Prisma.PayeeAccountCreateOrConnectWithoutExpensesInput;
    upsert?: Prisma.PayeeAccountUpsertWithoutExpensesInput;
    disconnect?: Prisma.PayeeAccountWhereInput | boolean;
    delete?: Prisma.PayeeAccountWhereInput | boolean;
    connect?: Prisma.PayeeAccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PayeeAccountUpdateToOneWithWhereWithoutExpensesInput, Prisma.PayeeAccountUpdateWithoutExpensesInput>, Prisma.PayeeAccountUncheckedUpdateWithoutExpensesInput>;
};
export type PayeeAccountCreateWithoutExpensesInput = {
    id?: string;
    name: string;
    type?: $Enums.PayeeType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PayeeAccountUncheckedCreateWithoutExpensesInput = {
    id?: string;
    name: string;
    type?: $Enums.PayeeType;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PayeeAccountCreateOrConnectWithoutExpensesInput = {
    where: Prisma.PayeeAccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.PayeeAccountCreateWithoutExpensesInput, Prisma.PayeeAccountUncheckedCreateWithoutExpensesInput>;
};
export type PayeeAccountUpsertWithoutExpensesInput = {
    update: Prisma.XOR<Prisma.PayeeAccountUpdateWithoutExpensesInput, Prisma.PayeeAccountUncheckedUpdateWithoutExpensesInput>;
    create: Prisma.XOR<Prisma.PayeeAccountCreateWithoutExpensesInput, Prisma.PayeeAccountUncheckedCreateWithoutExpensesInput>;
    where?: Prisma.PayeeAccountWhereInput;
};
export type PayeeAccountUpdateToOneWithWhereWithoutExpensesInput = {
    where?: Prisma.PayeeAccountWhereInput;
    data: Prisma.XOR<Prisma.PayeeAccountUpdateWithoutExpensesInput, Prisma.PayeeAccountUncheckedUpdateWithoutExpensesInput>;
};
export type PayeeAccountUpdateWithoutExpensesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayeeTypeFieldUpdateOperationsInput | $Enums.PayeeType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PayeeAccountUncheckedUpdateWithoutExpensesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumPayeeTypeFieldUpdateOperationsInput | $Enums.PayeeType;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PayeeAccountCountOutputType = {
    expenses: number;
};
export type PayeeAccountCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    expenses?: boolean | PayeeAccountCountOutputTypeCountExpensesArgs;
};
export type PayeeAccountCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountCountOutputTypeSelect<ExtArgs> | null;
};
export type PayeeAccountCountOutputTypeCountExpensesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpenseWhereInput;
};
export type PayeeAccountSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    type?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    expenses?: boolean | Prisma.PayeeAccount$expensesArgs<ExtArgs>;
    _count?: boolean | Prisma.PayeeAccountCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["payeeAccount"]>;
export type PayeeAccountSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    type?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["payeeAccount"]>;
export type PayeeAccountSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    type?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["payeeAccount"]>;
export type PayeeAccountSelectScalar = {
    id?: boolean;
    name?: boolean;
    type?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    notes?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PayeeAccountOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "type" | "phone" | "email" | "address" | "notes" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["payeeAccount"]>;
export type PayeeAccountInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    expenses?: boolean | Prisma.PayeeAccount$expensesArgs<ExtArgs>;
    _count?: boolean | Prisma.PayeeAccountCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PayeeAccountIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PayeeAccountIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PayeeAccountPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PayeeAccount";
    objects: {
        expenses: Prisma.$ExpensePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        type: $Enums.PayeeType;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["payeeAccount"]>;
    composites: {};
};
export type PayeeAccountGetPayload<S extends boolean | null | undefined | PayeeAccountDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload, S>;
export type PayeeAccountCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PayeeAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PayeeAccountCountAggregateInputType | true;
};
export interface PayeeAccountDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PayeeAccount'];
        meta: {
            name: 'PayeeAccount';
        };
    };
    findUnique<T extends PayeeAccountFindUniqueArgs>(args: Prisma.SelectSubset<T, PayeeAccountFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PayeeAccountFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PayeeAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PayeeAccountFindFirstArgs>(args?: Prisma.SelectSubset<T, PayeeAccountFindFirstArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PayeeAccountFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PayeeAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PayeeAccountFindManyArgs>(args?: Prisma.SelectSubset<T, PayeeAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PayeeAccountCreateArgs>(args: Prisma.SelectSubset<T, PayeeAccountCreateArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PayeeAccountCreateManyArgs>(args?: Prisma.SelectSubset<T, PayeeAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PayeeAccountCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PayeeAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PayeeAccountDeleteArgs>(args: Prisma.SelectSubset<T, PayeeAccountDeleteArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PayeeAccountUpdateArgs>(args: Prisma.SelectSubset<T, PayeeAccountUpdateArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PayeeAccountDeleteManyArgs>(args?: Prisma.SelectSubset<T, PayeeAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PayeeAccountUpdateManyArgs>(args: Prisma.SelectSubset<T, PayeeAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PayeeAccountUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PayeeAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PayeeAccountUpsertArgs>(args: Prisma.SelectSubset<T, PayeeAccountUpsertArgs<ExtArgs>>): Prisma.Prisma__PayeeAccountClient<runtime.Types.Result.GetResult<Prisma.$PayeeAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PayeeAccountCountArgs>(args?: Prisma.Subset<T, PayeeAccountCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PayeeAccountCountAggregateOutputType> : number>;
    aggregate<T extends PayeeAccountAggregateArgs>(args: Prisma.Subset<T, PayeeAccountAggregateArgs>): Prisma.PrismaPromise<GetPayeeAccountAggregateType<T>>;
    groupBy<T extends PayeeAccountGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PayeeAccountGroupByArgs['orderBy'];
    } : {
        orderBy?: PayeeAccountGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PayeeAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayeeAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PayeeAccountFieldRefs;
}
export interface Prisma__PayeeAccountClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    expenses<T extends Prisma.PayeeAccount$expensesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PayeeAccount$expensesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PayeeAccountFieldRefs {
    readonly id: Prisma.FieldRef<"PayeeAccount", 'String'>;
    readonly name: Prisma.FieldRef<"PayeeAccount", 'String'>;
    readonly type: Prisma.FieldRef<"PayeeAccount", 'PayeeType'>;
    readonly phone: Prisma.FieldRef<"PayeeAccount", 'String'>;
    readonly email: Prisma.FieldRef<"PayeeAccount", 'String'>;
    readonly address: Prisma.FieldRef<"PayeeAccount", 'String'>;
    readonly notes: Prisma.FieldRef<"PayeeAccount", 'String'>;
    readonly isActive: Prisma.FieldRef<"PayeeAccount", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"PayeeAccount", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PayeeAccount", 'DateTime'>;
}
export type PayeeAccountFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where: Prisma.PayeeAccountWhereUniqueInput;
};
export type PayeeAccountFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where: Prisma.PayeeAccountWhereUniqueInput;
};
export type PayeeAccountFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where?: Prisma.PayeeAccountWhereInput;
    orderBy?: Prisma.PayeeAccountOrderByWithRelationInput | Prisma.PayeeAccountOrderByWithRelationInput[];
    cursor?: Prisma.PayeeAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PayeeAccountScalarFieldEnum | Prisma.PayeeAccountScalarFieldEnum[];
};
export type PayeeAccountFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where?: Prisma.PayeeAccountWhereInput;
    orderBy?: Prisma.PayeeAccountOrderByWithRelationInput | Prisma.PayeeAccountOrderByWithRelationInput[];
    cursor?: Prisma.PayeeAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PayeeAccountScalarFieldEnum | Prisma.PayeeAccountScalarFieldEnum[];
};
export type PayeeAccountFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where?: Prisma.PayeeAccountWhereInput;
    orderBy?: Prisma.PayeeAccountOrderByWithRelationInput | Prisma.PayeeAccountOrderByWithRelationInput[];
    cursor?: Prisma.PayeeAccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PayeeAccountScalarFieldEnum | Prisma.PayeeAccountScalarFieldEnum[];
};
export type PayeeAccountCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PayeeAccountCreateInput, Prisma.PayeeAccountUncheckedCreateInput>;
};
export type PayeeAccountCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PayeeAccountCreateManyInput | Prisma.PayeeAccountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PayeeAccountCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    data: Prisma.PayeeAccountCreateManyInput | Prisma.PayeeAccountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PayeeAccountUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PayeeAccountUpdateInput, Prisma.PayeeAccountUncheckedUpdateInput>;
    where: Prisma.PayeeAccountWhereUniqueInput;
};
export type PayeeAccountUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PayeeAccountUpdateManyMutationInput, Prisma.PayeeAccountUncheckedUpdateManyInput>;
    where?: Prisma.PayeeAccountWhereInput;
    limit?: number;
};
export type PayeeAccountUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PayeeAccountUpdateManyMutationInput, Prisma.PayeeAccountUncheckedUpdateManyInput>;
    where?: Prisma.PayeeAccountWhereInput;
    limit?: number;
};
export type PayeeAccountUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where: Prisma.PayeeAccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.PayeeAccountCreateInput, Prisma.PayeeAccountUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PayeeAccountUpdateInput, Prisma.PayeeAccountUncheckedUpdateInput>;
};
export type PayeeAccountDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
    where: Prisma.PayeeAccountWhereUniqueInput;
};
export type PayeeAccountDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PayeeAccountWhereInput;
    limit?: number;
};
export type PayeeAccount$expensesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PayeeAccountDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PayeeAccountSelect<ExtArgs> | null;
    omit?: Prisma.PayeeAccountOmit<ExtArgs> | null;
    include?: Prisma.PayeeAccountInclude<ExtArgs> | null;
};
