import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type ExpenseModel = runtime.Types.Result.DefaultSelection<Prisma.$ExpensePayload>;
export type AggregateExpense = {
    _count: ExpenseCountAggregateOutputType | null;
    _avg: ExpenseAvgAggregateOutputType | null;
    _sum: ExpenseSumAggregateOutputType | null;
    _min: ExpenseMinAggregateOutputType | null;
    _max: ExpenseMaxAggregateOutputType | null;
};
export type ExpenseAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type ExpenseSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type ExpenseMinAggregateOutputType = {
    id: string | null;
    amount: runtime.Decimal | null;
    date: Date | null;
    category: $Enums.ExpenseCategory | null;
    description: string | null;
    branchId: string | null;
    recordedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ExpenseMaxAggregateOutputType = {
    id: string | null;
    amount: runtime.Decimal | null;
    date: Date | null;
    category: $Enums.ExpenseCategory | null;
    description: string | null;
    branchId: string | null;
    recordedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ExpenseCountAggregateOutputType = {
    id: number;
    amount: number;
    date: number;
    category: number;
    description: number;
    branchId: number;
    recordedById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ExpenseAvgAggregateInputType = {
    amount?: true;
};
export type ExpenseSumAggregateInputType = {
    amount?: true;
};
export type ExpenseMinAggregateInputType = {
    id?: true;
    amount?: true;
    date?: true;
    category?: true;
    description?: true;
    branchId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ExpenseMaxAggregateInputType = {
    id?: true;
    amount?: true;
    date?: true;
    category?: true;
    description?: true;
    branchId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ExpenseCountAggregateInputType = {
    id?: true;
    amount?: true;
    date?: true;
    category?: true;
    description?: true;
    branchId?: true;
    recordedById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ExpenseAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpenseWhereInput;
    orderBy?: Prisma.ExpenseOrderByWithRelationInput | Prisma.ExpenseOrderByWithRelationInput[];
    cursor?: Prisma.ExpenseWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ExpenseCountAggregateInputType;
    _avg?: ExpenseAvgAggregateInputType;
    _sum?: ExpenseSumAggregateInputType;
    _min?: ExpenseMinAggregateInputType;
    _max?: ExpenseMaxAggregateInputType;
};
export type GetExpenseAggregateType<T extends ExpenseAggregateArgs> = {
    [P in keyof T & keyof AggregateExpense]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateExpense[P]> : Prisma.GetScalarType<T[P], AggregateExpense[P]>;
};
export type ExpenseGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpenseWhereInput;
    orderBy?: Prisma.ExpenseOrderByWithAggregationInput | Prisma.ExpenseOrderByWithAggregationInput[];
    by: Prisma.ExpenseScalarFieldEnum[] | Prisma.ExpenseScalarFieldEnum;
    having?: Prisma.ExpenseScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ExpenseCountAggregateInputType | true;
    _avg?: ExpenseAvgAggregateInputType;
    _sum?: ExpenseSumAggregateInputType;
    _min?: ExpenseMinAggregateInputType;
    _max?: ExpenseMaxAggregateInputType;
};
export type ExpenseGroupByOutputType = {
    id: string;
    amount: runtime.Decimal;
    date: Date;
    category: $Enums.ExpenseCategory;
    description: string | null;
    branchId: string;
    recordedById: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ExpenseCountAggregateOutputType | null;
    _avg: ExpenseAvgAggregateOutputType | null;
    _sum: ExpenseSumAggregateOutputType | null;
    _min: ExpenseMinAggregateOutputType | null;
    _max: ExpenseMaxAggregateOutputType | null;
};
export type GetExpenseGroupByPayload<T extends ExpenseGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ExpenseGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ExpenseGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ExpenseGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ExpenseGroupByOutputType[P]>;
}>>;
export type ExpenseWhereInput = {
    AND?: Prisma.ExpenseWhereInput | Prisma.ExpenseWhereInput[];
    OR?: Prisma.ExpenseWhereInput[];
    NOT?: Prisma.ExpenseWhereInput | Prisma.ExpenseWhereInput[];
    id?: Prisma.StringFilter<"Expense"> | string;
    amount?: Prisma.DecimalFilter<"Expense"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    category?: Prisma.EnumExpenseCategoryFilter<"Expense"> | $Enums.ExpenseCategory;
    description?: Prisma.StringNullableFilter<"Expense"> | string | null;
    branchId?: Prisma.StringFilter<"Expense"> | string;
    recordedById?: Prisma.StringFilter<"Expense"> | string;
    createdAt?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
    recordedBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ExpenseOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
    recordedBy?: Prisma.UserOrderByWithRelationInput;
};
export type ExpenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ExpenseWhereInput | Prisma.ExpenseWhereInput[];
    OR?: Prisma.ExpenseWhereInput[];
    NOT?: Prisma.ExpenseWhereInput | Prisma.ExpenseWhereInput[];
    amount?: Prisma.DecimalFilter<"Expense"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    category?: Prisma.EnumExpenseCategoryFilter<"Expense"> | $Enums.ExpenseCategory;
    description?: Prisma.StringNullableFilter<"Expense"> | string | null;
    branchId?: Prisma.StringFilter<"Expense"> | string;
    recordedById?: Prisma.StringFilter<"Expense"> | string;
    createdAt?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
    recordedBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type ExpenseOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ExpenseCountOrderByAggregateInput;
    _avg?: Prisma.ExpenseAvgOrderByAggregateInput;
    _max?: Prisma.ExpenseMaxOrderByAggregateInput;
    _min?: Prisma.ExpenseMinOrderByAggregateInput;
    _sum?: Prisma.ExpenseSumOrderByAggregateInput;
};
export type ExpenseScalarWhereWithAggregatesInput = {
    AND?: Prisma.ExpenseScalarWhereWithAggregatesInput | Prisma.ExpenseScalarWhereWithAggregatesInput[];
    OR?: Prisma.ExpenseScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ExpenseScalarWhereWithAggregatesInput | Prisma.ExpenseScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Expense"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"Expense"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"Expense"> | Date | string;
    category?: Prisma.EnumExpenseCategoryWithAggregatesFilter<"Expense"> | $Enums.ExpenseCategory;
    description?: Prisma.StringNullableWithAggregatesFilter<"Expense"> | string | null;
    branchId?: Prisma.StringWithAggregatesFilter<"Expense"> | string;
    recordedById?: Prisma.StringWithAggregatesFilter<"Expense"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Expense"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Expense"> | Date | string;
};
export type ExpenseCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutExpensesInput;
    recordedBy: Prisma.UserCreateNestedOneWithoutRecordedExpensesInput;
};
export type ExpenseUncheckedCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    branchId: string;
    recordedById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ExpenseUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutExpensesNestedInput;
    recordedBy?: Prisma.UserUpdateOneRequiredWithoutRecordedExpensesNestedInput;
};
export type ExpenseUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseCreateManyInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    branchId: string;
    recordedById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ExpenseUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    recordedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseListRelationFilter = {
    every?: Prisma.ExpenseWhereInput;
    some?: Prisma.ExpenseWhereInput;
    none?: Prisma.ExpenseWhereInput;
};
export type ExpenseOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ExpenseCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ExpenseAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ExpenseMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ExpenseMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    branchId?: Prisma.SortOrder;
    recordedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ExpenseSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ExpenseCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutRecordedByInput, Prisma.ExpenseUncheckedCreateWithoutRecordedByInput> | Prisma.ExpenseCreateWithoutRecordedByInput[] | Prisma.ExpenseUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutRecordedByInput | Prisma.ExpenseCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.ExpenseCreateManyRecordedByInputEnvelope;
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
};
export type ExpenseUncheckedCreateNestedManyWithoutRecordedByInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutRecordedByInput, Prisma.ExpenseUncheckedCreateWithoutRecordedByInput> | Prisma.ExpenseCreateWithoutRecordedByInput[] | Prisma.ExpenseUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutRecordedByInput | Prisma.ExpenseCreateOrConnectWithoutRecordedByInput[];
    createMany?: Prisma.ExpenseCreateManyRecordedByInputEnvelope;
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
};
export type ExpenseUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutRecordedByInput, Prisma.ExpenseUncheckedCreateWithoutRecordedByInput> | Prisma.ExpenseCreateWithoutRecordedByInput[] | Prisma.ExpenseUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutRecordedByInput | Prisma.ExpenseCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.ExpenseUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.ExpenseUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.ExpenseCreateManyRecordedByInputEnvelope;
    set?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    disconnect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    delete?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    update?: Prisma.ExpenseUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.ExpenseUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.ExpenseUpdateManyWithWhereWithoutRecordedByInput | Prisma.ExpenseUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.ExpenseScalarWhereInput | Prisma.ExpenseScalarWhereInput[];
};
export type ExpenseUncheckedUpdateManyWithoutRecordedByNestedInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutRecordedByInput, Prisma.ExpenseUncheckedCreateWithoutRecordedByInput> | Prisma.ExpenseCreateWithoutRecordedByInput[] | Prisma.ExpenseUncheckedCreateWithoutRecordedByInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutRecordedByInput | Prisma.ExpenseCreateOrConnectWithoutRecordedByInput[];
    upsert?: Prisma.ExpenseUpsertWithWhereUniqueWithoutRecordedByInput | Prisma.ExpenseUpsertWithWhereUniqueWithoutRecordedByInput[];
    createMany?: Prisma.ExpenseCreateManyRecordedByInputEnvelope;
    set?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    disconnect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    delete?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    update?: Prisma.ExpenseUpdateWithWhereUniqueWithoutRecordedByInput | Prisma.ExpenseUpdateWithWhereUniqueWithoutRecordedByInput[];
    updateMany?: Prisma.ExpenseUpdateManyWithWhereWithoutRecordedByInput | Prisma.ExpenseUpdateManyWithWhereWithoutRecordedByInput[];
    deleteMany?: Prisma.ExpenseScalarWhereInput | Prisma.ExpenseScalarWhereInput[];
};
export type ExpenseCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutBranchInput, Prisma.ExpenseUncheckedCreateWithoutBranchInput> | Prisma.ExpenseCreateWithoutBranchInput[] | Prisma.ExpenseUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutBranchInput | Prisma.ExpenseCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.ExpenseCreateManyBranchInputEnvelope;
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
};
export type ExpenseUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutBranchInput, Prisma.ExpenseUncheckedCreateWithoutBranchInput> | Prisma.ExpenseCreateWithoutBranchInput[] | Prisma.ExpenseUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutBranchInput | Prisma.ExpenseCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.ExpenseCreateManyBranchInputEnvelope;
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
};
export type ExpenseUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutBranchInput, Prisma.ExpenseUncheckedCreateWithoutBranchInput> | Prisma.ExpenseCreateWithoutBranchInput[] | Prisma.ExpenseUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutBranchInput | Prisma.ExpenseCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.ExpenseUpsertWithWhereUniqueWithoutBranchInput | Prisma.ExpenseUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.ExpenseCreateManyBranchInputEnvelope;
    set?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    disconnect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    delete?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    update?: Prisma.ExpenseUpdateWithWhereUniqueWithoutBranchInput | Prisma.ExpenseUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.ExpenseUpdateManyWithWhereWithoutBranchInput | Prisma.ExpenseUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.ExpenseScalarWhereInput | Prisma.ExpenseScalarWhereInput[];
};
export type ExpenseUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.ExpenseCreateWithoutBranchInput, Prisma.ExpenseUncheckedCreateWithoutBranchInput> | Prisma.ExpenseCreateWithoutBranchInput[] | Prisma.ExpenseUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ExpenseCreateOrConnectWithoutBranchInput | Prisma.ExpenseCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.ExpenseUpsertWithWhereUniqueWithoutBranchInput | Prisma.ExpenseUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.ExpenseCreateManyBranchInputEnvelope;
    set?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    disconnect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    delete?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    connect?: Prisma.ExpenseWhereUniqueInput | Prisma.ExpenseWhereUniqueInput[];
    update?: Prisma.ExpenseUpdateWithWhereUniqueWithoutBranchInput | Prisma.ExpenseUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.ExpenseUpdateManyWithWhereWithoutBranchInput | Prisma.ExpenseUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.ExpenseScalarWhereInput | Prisma.ExpenseScalarWhereInput[];
};
export type EnumExpenseCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ExpenseCategory;
};
export type ExpenseCreateWithoutRecordedByInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutExpensesInput;
};
export type ExpenseUncheckedCreateWithoutRecordedByInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    branchId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ExpenseCreateOrConnectWithoutRecordedByInput = {
    where: Prisma.ExpenseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ExpenseCreateWithoutRecordedByInput, Prisma.ExpenseUncheckedCreateWithoutRecordedByInput>;
};
export type ExpenseCreateManyRecordedByInputEnvelope = {
    data: Prisma.ExpenseCreateManyRecordedByInput | Prisma.ExpenseCreateManyRecordedByInput[];
    skipDuplicates?: boolean;
};
export type ExpenseUpsertWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.ExpenseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ExpenseUpdateWithoutRecordedByInput, Prisma.ExpenseUncheckedUpdateWithoutRecordedByInput>;
    create: Prisma.XOR<Prisma.ExpenseCreateWithoutRecordedByInput, Prisma.ExpenseUncheckedCreateWithoutRecordedByInput>;
};
export type ExpenseUpdateWithWhereUniqueWithoutRecordedByInput = {
    where: Prisma.ExpenseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ExpenseUpdateWithoutRecordedByInput, Prisma.ExpenseUncheckedUpdateWithoutRecordedByInput>;
};
export type ExpenseUpdateManyWithWhereWithoutRecordedByInput = {
    where: Prisma.ExpenseScalarWhereInput;
    data: Prisma.XOR<Prisma.ExpenseUpdateManyMutationInput, Prisma.ExpenseUncheckedUpdateManyWithoutRecordedByInput>;
};
export type ExpenseScalarWhereInput = {
    AND?: Prisma.ExpenseScalarWhereInput | Prisma.ExpenseScalarWhereInput[];
    OR?: Prisma.ExpenseScalarWhereInput[];
    NOT?: Prisma.ExpenseScalarWhereInput | Prisma.ExpenseScalarWhereInput[];
    id?: Prisma.StringFilter<"Expense"> | string;
    amount?: Prisma.DecimalFilter<"Expense"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    category?: Prisma.EnumExpenseCategoryFilter<"Expense"> | $Enums.ExpenseCategory;
    description?: Prisma.StringNullableFilter<"Expense"> | string | null;
    branchId?: Prisma.StringFilter<"Expense"> | string;
    recordedById?: Prisma.StringFilter<"Expense"> | string;
    createdAt?: Prisma.DateTimeFilter<"Expense"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Expense"> | Date | string;
};
export type ExpenseCreateWithoutBranchInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recordedBy: Prisma.UserCreateNestedOneWithoutRecordedExpensesInput;
};
export type ExpenseUncheckedCreateWithoutBranchInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    recordedById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ExpenseCreateOrConnectWithoutBranchInput = {
    where: Prisma.ExpenseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ExpenseCreateWithoutBranchInput, Prisma.ExpenseUncheckedCreateWithoutBranchInput>;
};
export type ExpenseCreateManyBranchInputEnvelope = {
    data: Prisma.ExpenseCreateManyBranchInput | Prisma.ExpenseCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type ExpenseUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.ExpenseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ExpenseUpdateWithoutBranchInput, Prisma.ExpenseUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.ExpenseCreateWithoutBranchInput, Prisma.ExpenseUncheckedCreateWithoutBranchInput>;
};
export type ExpenseUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.ExpenseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ExpenseUpdateWithoutBranchInput, Prisma.ExpenseUncheckedUpdateWithoutBranchInput>;
};
export type ExpenseUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.ExpenseScalarWhereInput;
    data: Prisma.XOR<Prisma.ExpenseUpdateManyMutationInput, Prisma.ExpenseUncheckedUpdateManyWithoutBranchInput>;
};
export type ExpenseCreateManyRecordedByInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    branchId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ExpenseUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutExpensesNestedInput;
};
export type ExpenseUncheckedUpdateWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseUncheckedUpdateManyWithoutRecordedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    branchId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseCreateManyBranchInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    date: Date | string;
    category: $Enums.ExpenseCategory;
    description?: string | null;
    recordedById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ExpenseUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recordedBy?: Prisma.UserUpdateOneRequiredWithoutRecordedExpensesNestedInput;
};
export type ExpenseUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ExpenseSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    amount?: boolean;
    date?: boolean;
    category?: boolean;
    description?: boolean;
    branchId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["expense"]>;
export type ExpenseSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    amount?: boolean;
    date?: boolean;
    category?: boolean;
    description?: boolean;
    branchId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["expense"]>;
export type ExpenseSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    amount?: boolean;
    date?: boolean;
    category?: boolean;
    description?: boolean;
    branchId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["expense"]>;
export type ExpenseSelectScalar = {
    id?: boolean;
    amount?: boolean;
    date?: boolean;
    category?: boolean;
    description?: boolean;
    branchId?: boolean;
    recordedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ExpenseOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "amount" | "date" | "category" | "description" | "branchId" | "recordedById" | "createdAt" | "updatedAt", ExtArgs["result"]["expense"]>;
export type ExpenseInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ExpenseIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ExpenseIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
    recordedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ExpensePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Expense";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
        recordedBy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        amount: runtime.Decimal;
        date: Date;
        category: $Enums.ExpenseCategory;
        description: string | null;
        branchId: string;
        recordedById: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["expense"]>;
    composites: {};
};
export type ExpenseGetPayload<S extends boolean | null | undefined | ExpenseDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ExpensePayload, S>;
export type ExpenseCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ExpenseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ExpenseCountAggregateInputType | true;
};
export interface ExpenseDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Expense'];
        meta: {
            name: 'Expense';
        };
    };
    findUnique<T extends ExpenseFindUniqueArgs>(args: Prisma.SelectSubset<T, ExpenseFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ExpenseFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ExpenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ExpenseFindFirstArgs>(args?: Prisma.SelectSubset<T, ExpenseFindFirstArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ExpenseFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ExpenseFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ExpenseFindManyArgs>(args?: Prisma.SelectSubset<T, ExpenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ExpenseCreateArgs>(args: Prisma.SelectSubset<T, ExpenseCreateArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ExpenseCreateManyArgs>(args?: Prisma.SelectSubset<T, ExpenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ExpenseCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ExpenseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ExpenseDeleteArgs>(args: Prisma.SelectSubset<T, ExpenseDeleteArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ExpenseUpdateArgs>(args: Prisma.SelectSubset<T, ExpenseUpdateArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ExpenseDeleteManyArgs>(args?: Prisma.SelectSubset<T, ExpenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ExpenseUpdateManyArgs>(args: Prisma.SelectSubset<T, ExpenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ExpenseUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ExpenseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ExpenseUpsertArgs>(args: Prisma.SelectSubset<T, ExpenseUpsertArgs<ExtArgs>>): Prisma.Prisma__ExpenseClient<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ExpenseCountArgs>(args?: Prisma.Subset<T, ExpenseCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ExpenseCountAggregateOutputType> : number>;
    aggregate<T extends ExpenseAggregateArgs>(args: Prisma.Subset<T, ExpenseAggregateArgs>): Prisma.PrismaPromise<GetExpenseAggregateType<T>>;
    groupBy<T extends ExpenseGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ExpenseGroupByArgs['orderBy'];
    } : {
        orderBy?: ExpenseGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ExpenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ExpenseFieldRefs;
}
export interface Prisma__ExpenseClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branch<T extends Prisma.BranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BranchDefaultArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    recordedBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ExpenseFieldRefs {
    readonly id: Prisma.FieldRef<"Expense", 'String'>;
    readonly amount: Prisma.FieldRef<"Expense", 'Decimal'>;
    readonly date: Prisma.FieldRef<"Expense", 'DateTime'>;
    readonly category: Prisma.FieldRef<"Expense", 'ExpenseCategory'>;
    readonly description: Prisma.FieldRef<"Expense", 'String'>;
    readonly branchId: Prisma.FieldRef<"Expense", 'String'>;
    readonly recordedById: Prisma.FieldRef<"Expense", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Expense", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Expense", 'DateTime'>;
}
export type ExpenseFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    where: Prisma.ExpenseWhereUniqueInput;
};
export type ExpenseFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    where: Prisma.ExpenseWhereUniqueInput;
};
export type ExpenseFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ExpenseFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ExpenseFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ExpenseCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ExpenseCreateInput, Prisma.ExpenseUncheckedCreateInput>;
};
export type ExpenseCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ExpenseCreateManyInput | Prisma.ExpenseCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ExpenseCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    data: Prisma.ExpenseCreateManyInput | Prisma.ExpenseCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ExpenseIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ExpenseUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ExpenseUpdateInput, Prisma.ExpenseUncheckedUpdateInput>;
    where: Prisma.ExpenseWhereUniqueInput;
};
export type ExpenseUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ExpenseUpdateManyMutationInput, Prisma.ExpenseUncheckedUpdateManyInput>;
    where?: Prisma.ExpenseWhereInput;
    limit?: number;
};
export type ExpenseUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ExpenseUpdateManyMutationInput, Prisma.ExpenseUncheckedUpdateManyInput>;
    where?: Prisma.ExpenseWhereInput;
    limit?: number;
    include?: Prisma.ExpenseIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ExpenseUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    where: Prisma.ExpenseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ExpenseCreateInput, Prisma.ExpenseUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ExpenseUpdateInput, Prisma.ExpenseUncheckedUpdateInput>;
};
export type ExpenseDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    where: Prisma.ExpenseWhereUniqueInput;
};
export type ExpenseDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpenseWhereInput;
    limit?: number;
};
export type ExpenseDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
};
