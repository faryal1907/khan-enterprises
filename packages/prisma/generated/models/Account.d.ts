import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type AccountModel = runtime.Types.Result.DefaultSelection<Prisma.$AccountPayload>;
export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
};
export type AccountAvgAggregateOutputType = {
    openingBalance: runtime.Decimal | null;
};
export type AccountSumAggregateOutputType = {
    openingBalance: runtime.Decimal | null;
};
export type AccountMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    category: $Enums.AccountCategory | null;
    subtype: $Enums.AccountSubtype | null;
    accountNumber: string | null;
    openingBalance: runtime.Decimal | null;
    isActive: boolean | null;
    isSystem: boolean | null;
};
export type AccountMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    category: $Enums.AccountCategory | null;
    subtype: $Enums.AccountSubtype | null;
    accountNumber: string | null;
    openingBalance: runtime.Decimal | null;
    isActive: boolean | null;
    isSystem: boolean | null;
};
export type AccountCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    category: number;
    subtype: number;
    accountNumber: number;
    openingBalance: number;
    isActive: number;
    isSystem: number;
    _all: number;
};
export type AccountAvgAggregateInputType = {
    openingBalance?: true;
};
export type AccountSumAggregateInputType = {
    openingBalance?: true;
};
export type AccountMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    category?: true;
    subtype?: true;
    accountNumber?: true;
    openingBalance?: true;
    isActive?: true;
    isSystem?: true;
};
export type AccountMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    category?: true;
    subtype?: true;
    accountNumber?: true;
    openingBalance?: true;
    isActive?: true;
    isSystem?: true;
};
export type AccountCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    category?: true;
    subtype?: true;
    accountNumber?: true;
    openingBalance?: true;
    isActive?: true;
    isSystem?: true;
    _all?: true;
};
export type AccountAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AccountCountAggregateInputType;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
};
export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAccount[P]> : Prisma.GetScalarType<T[P], AggregateAccount[P]>;
};
export type AccountGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithAggregationInput | Prisma.AccountOrderByWithAggregationInput[];
    by: Prisma.AccountScalarFieldEnum[] | Prisma.AccountScalarFieldEnum;
    having?: Prisma.AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
};
export type AccountGroupByOutputType = {
    id: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber: string | null;
    openingBalance: runtime.Decimal;
    isActive: boolean;
    isSystem: boolean;
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
};
export type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AccountGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AccountGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AccountGroupByOutputType[P]>;
}>>;
export type AccountWhereInput = {
    AND?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    OR?: Prisma.AccountWhereInput[];
    NOT?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    id?: Prisma.StringFilter<"Account"> | string;
    code?: Prisma.StringFilter<"Account"> | string;
    name?: Prisma.StringFilter<"Account"> | string;
    category?: Prisma.EnumAccountCategoryFilter<"Account"> | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFilter<"Account"> | $Enums.AccountSubtype;
    accountNumber?: Prisma.StringNullableFilter<"Account"> | string | null;
    openingBalance?: Prisma.DecimalFilter<"Account"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFilter<"Account"> | boolean;
    isSystem?: Prisma.BoolFilter<"Account"> | boolean;
    lines?: Prisma.JournalEntryLineListRelationFilter;
    payments?: Prisma.PaymentTransactionListRelationFilter;
    partPaymentTransactions?: Prisma.PartPaymentTransactionListRelationFilter;
    orderPayments?: Prisma.OrderListRelationFilter;
    partOrderPayments?: Prisma.PartOrderListRelationFilter;
    vendorPayments?: Prisma.VendorPaymentListRelationFilter;
    receivablePayments?: Prisma.ReceivablePaymentListRelationFilter;
};
export type AccountOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    subtype?: Prisma.SortOrder;
    accountNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    openingBalance?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
    lines?: Prisma.JournalEntryLineOrderByRelationAggregateInput;
    payments?: Prisma.PaymentTransactionOrderByRelationAggregateInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionOrderByRelationAggregateInput;
    orderPayments?: Prisma.OrderOrderByRelationAggregateInput;
    partOrderPayments?: Prisma.PartOrderOrderByRelationAggregateInput;
    vendorPayments?: Prisma.VendorPaymentOrderByRelationAggregateInput;
    receivablePayments?: Prisma.ReceivablePaymentOrderByRelationAggregateInput;
};
export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    OR?: Prisma.AccountWhereInput[];
    NOT?: Prisma.AccountWhereInput | Prisma.AccountWhereInput[];
    name?: Prisma.StringFilter<"Account"> | string;
    category?: Prisma.EnumAccountCategoryFilter<"Account"> | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFilter<"Account"> | $Enums.AccountSubtype;
    accountNumber?: Prisma.StringNullableFilter<"Account"> | string | null;
    openingBalance?: Prisma.DecimalFilter<"Account"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFilter<"Account"> | boolean;
    isSystem?: Prisma.BoolFilter<"Account"> | boolean;
    lines?: Prisma.JournalEntryLineListRelationFilter;
    payments?: Prisma.PaymentTransactionListRelationFilter;
    partPaymentTransactions?: Prisma.PartPaymentTransactionListRelationFilter;
    orderPayments?: Prisma.OrderListRelationFilter;
    partOrderPayments?: Prisma.PartOrderListRelationFilter;
    vendorPayments?: Prisma.VendorPaymentListRelationFilter;
    receivablePayments?: Prisma.ReceivablePaymentListRelationFilter;
}, "id" | "code">;
export type AccountOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    subtype?: Prisma.SortOrder;
    accountNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    openingBalance?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
    _count?: Prisma.AccountCountOrderByAggregateInput;
    _avg?: Prisma.AccountAvgOrderByAggregateInput;
    _max?: Prisma.AccountMaxOrderByAggregateInput;
    _min?: Prisma.AccountMinOrderByAggregateInput;
    _sum?: Prisma.AccountSumOrderByAggregateInput;
};
export type AccountScalarWhereWithAggregatesInput = {
    AND?: Prisma.AccountScalarWhereWithAggregatesInput | Prisma.AccountScalarWhereWithAggregatesInput[];
    OR?: Prisma.AccountScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AccountScalarWhereWithAggregatesInput | Prisma.AccountScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Account"> | string;
    category?: Prisma.EnumAccountCategoryWithAggregatesFilter<"Account"> | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeWithAggregatesFilter<"Account"> | $Enums.AccountSubtype;
    accountNumber?: Prisma.StringNullableWithAggregatesFilter<"Account"> | string | null;
    openingBalance?: Prisma.DecimalWithAggregatesFilter<"Account"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"Account"> | boolean;
    isSystem?: Prisma.BoolWithAggregatesFilter<"Account"> | boolean;
};
export type AccountCreateInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateManyInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
};
export type AccountUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type AccountUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type AccountNullableScalarRelationFilter = {
    is?: Prisma.AccountWhereInput | null;
    isNot?: Prisma.AccountWhereInput | null;
};
export type AccountCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    subtype?: Prisma.SortOrder;
    accountNumber?: Prisma.SortOrder;
    openingBalance?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
};
export type AccountAvgOrderByAggregateInput = {
    openingBalance?: Prisma.SortOrder;
};
export type AccountMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    subtype?: Prisma.SortOrder;
    accountNumber?: Prisma.SortOrder;
    openingBalance?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
};
export type AccountMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    subtype?: Prisma.SortOrder;
    accountNumber?: Prisma.SortOrder;
    openingBalance?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
};
export type AccountSumOrderByAggregateInput = {
    openingBalance?: Prisma.SortOrder;
};
export type AccountScalarRelationFilter = {
    is?: Prisma.AccountWhereInput;
    isNot?: Prisma.AccountWhereInput;
};
export type AccountCreateNestedOneWithoutOrderPaymentsInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutOrderPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutOrderPaymentsInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneWithoutOrderPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutOrderPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutOrderPaymentsInput;
    upsert?: Prisma.AccountUpsertWithoutOrderPaymentsInput;
    disconnect?: Prisma.AccountWhereInput | boolean;
    delete?: Prisma.AccountWhereInput | boolean;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutOrderPaymentsInput, Prisma.AccountUpdateWithoutOrderPaymentsInput>, Prisma.AccountUncheckedUpdateWithoutOrderPaymentsInput>;
};
export type AccountCreateNestedOneWithoutPartOrderPaymentsInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutPartOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutPartOrderPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutPartOrderPaymentsInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneWithoutPartOrderPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutPartOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutPartOrderPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutPartOrderPaymentsInput;
    upsert?: Prisma.AccountUpsertWithoutPartOrderPaymentsInput;
    disconnect?: Prisma.AccountWhereInput | boolean;
    delete?: Prisma.AccountWhereInput | boolean;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutPartOrderPaymentsInput, Prisma.AccountUpdateWithoutPartOrderPaymentsInput>, Prisma.AccountUncheckedUpdateWithoutPartOrderPaymentsInput>;
};
export type AccountCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutPaymentsInput, Prisma.AccountUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutPaymentsInput, Prisma.AccountUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.AccountUpsertWithoutPaymentsInput;
    disconnect?: Prisma.AccountWhereInput | boolean;
    delete?: Prisma.AccountWhereInput | boolean;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutPaymentsInput, Prisma.AccountUpdateWithoutPaymentsInput>, Prisma.AccountUncheckedUpdateWithoutPaymentsInput>;
};
export type AccountCreateNestedOneWithoutPartPaymentTransactionsInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutPartPaymentTransactionsInput, Prisma.AccountUncheckedCreateWithoutPartPaymentTransactionsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutPartPaymentTransactionsInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneWithoutPartPaymentTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutPartPaymentTransactionsInput, Prisma.AccountUncheckedCreateWithoutPartPaymentTransactionsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutPartPaymentTransactionsInput;
    upsert?: Prisma.AccountUpsertWithoutPartPaymentTransactionsInput;
    disconnect?: Prisma.AccountWhereInput | boolean;
    delete?: Prisma.AccountWhereInput | boolean;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutPartPaymentTransactionsInput, Prisma.AccountUpdateWithoutPartPaymentTransactionsInput>, Prisma.AccountUncheckedUpdateWithoutPartPaymentTransactionsInput>;
};
export type EnumAccountCategoryFieldUpdateOperationsInput = {
    set?: $Enums.AccountCategory;
};
export type EnumAccountSubtypeFieldUpdateOperationsInput = {
    set?: $Enums.AccountSubtype;
};
export type AccountCreateNestedOneWithoutLinesInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutLinesInput, Prisma.AccountUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutLinesInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneRequiredWithoutLinesNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutLinesInput, Prisma.AccountUncheckedCreateWithoutLinesInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutLinesInput;
    upsert?: Prisma.AccountUpsertWithoutLinesInput;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutLinesInput, Prisma.AccountUpdateWithoutLinesInput>, Prisma.AccountUncheckedUpdateWithoutLinesInput>;
};
export type AccountCreateNestedOneWithoutVendorPaymentsInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutVendorPaymentsInput, Prisma.AccountUncheckedCreateWithoutVendorPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutVendorPaymentsInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneRequiredWithoutVendorPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutVendorPaymentsInput, Prisma.AccountUncheckedCreateWithoutVendorPaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutVendorPaymentsInput;
    upsert?: Prisma.AccountUpsertWithoutVendorPaymentsInput;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutVendorPaymentsInput, Prisma.AccountUpdateWithoutVendorPaymentsInput>, Prisma.AccountUncheckedUpdateWithoutVendorPaymentsInput>;
};
export type AccountCreateNestedOneWithoutReceivablePaymentsInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutReceivablePaymentsInput, Prisma.AccountUncheckedCreateWithoutReceivablePaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutReceivablePaymentsInput;
    connect?: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateOneWithoutReceivablePaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.AccountCreateWithoutReceivablePaymentsInput, Prisma.AccountUncheckedCreateWithoutReceivablePaymentsInput>;
    connectOrCreate?: Prisma.AccountCreateOrConnectWithoutReceivablePaymentsInput;
    upsert?: Prisma.AccountUpsertWithoutReceivablePaymentsInput;
    disconnect?: Prisma.AccountWhereInput | boolean;
    delete?: Prisma.AccountWhereInput | boolean;
    connect?: Prisma.AccountWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AccountUpdateToOneWithWhereWithoutReceivablePaymentsInput, Prisma.AccountUpdateWithoutReceivablePaymentsInput>, Prisma.AccountUncheckedUpdateWithoutReceivablePaymentsInput>;
};
export type AccountCreateWithoutOrderPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateWithoutOrderPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountCreateOrConnectWithoutOrderPaymentsInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutOrderPaymentsInput>;
};
export type AccountUpsertWithoutOrderPaymentsInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutOrderPaymentsInput, Prisma.AccountUncheckedUpdateWithoutOrderPaymentsInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutOrderPaymentsInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutOrderPaymentsInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutOrderPaymentsInput, Prisma.AccountUncheckedUpdateWithoutOrderPaymentsInput>;
};
export type AccountUpdateWithoutOrderPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutOrderPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateWithoutPartOrderPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateWithoutPartOrderPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountCreateOrConnectWithoutPartOrderPaymentsInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutPartOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutPartOrderPaymentsInput>;
};
export type AccountUpsertWithoutPartOrderPaymentsInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutPartOrderPaymentsInput, Prisma.AccountUncheckedUpdateWithoutPartOrderPaymentsInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutPartOrderPaymentsInput, Prisma.AccountUncheckedCreateWithoutPartOrderPaymentsInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutPartOrderPaymentsInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutPartOrderPaymentsInput, Prisma.AccountUncheckedUpdateWithoutPartOrderPaymentsInput>;
};
export type AccountUpdateWithoutPartOrderPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutPartOrderPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateWithoutPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutPaymentsInput, Prisma.AccountUncheckedCreateWithoutPaymentsInput>;
};
export type AccountUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutPaymentsInput, Prisma.AccountUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutPaymentsInput, Prisma.AccountUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutPaymentsInput, Prisma.AccountUncheckedUpdateWithoutPaymentsInput>;
};
export type AccountUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateWithoutPartPaymentTransactionsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateWithoutPartPaymentTransactionsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountCreateOrConnectWithoutPartPaymentTransactionsInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutPartPaymentTransactionsInput, Prisma.AccountUncheckedCreateWithoutPartPaymentTransactionsInput>;
};
export type AccountUpsertWithoutPartPaymentTransactionsInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutPartPaymentTransactionsInput, Prisma.AccountUncheckedUpdateWithoutPartPaymentTransactionsInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutPartPaymentTransactionsInput, Prisma.AccountUncheckedCreateWithoutPartPaymentTransactionsInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutPartPaymentTransactionsInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutPartPaymentTransactionsInput, Prisma.AccountUncheckedUpdateWithoutPartPaymentTransactionsInput>;
};
export type AccountUpdateWithoutPartPaymentTransactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutPartPaymentTransactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateWithoutLinesInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateWithoutLinesInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountCreateOrConnectWithoutLinesInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutLinesInput, Prisma.AccountUncheckedCreateWithoutLinesInput>;
};
export type AccountUpsertWithoutLinesInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutLinesInput, Prisma.AccountUncheckedUpdateWithoutLinesInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutLinesInput, Prisma.AccountUncheckedCreateWithoutLinesInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutLinesInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutLinesInput, Prisma.AccountUncheckedUpdateWithoutLinesInput>;
};
export type AccountUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutLinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateWithoutVendorPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentCreateNestedManyWithoutAccountInput;
};
export type AccountUncheckedCreateWithoutVendorPaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedCreateNestedManyWithoutAccountInput;
};
export type AccountCreateOrConnectWithoutVendorPaymentsInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutVendorPaymentsInput, Prisma.AccountUncheckedCreateWithoutVendorPaymentsInput>;
};
export type AccountUpsertWithoutVendorPaymentsInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutVendorPaymentsInput, Prisma.AccountUncheckedUpdateWithoutVendorPaymentsInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutVendorPaymentsInput, Prisma.AccountUncheckedCreateWithoutVendorPaymentsInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutVendorPaymentsInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutVendorPaymentsInput, Prisma.AccountUncheckedUpdateWithoutVendorPaymentsInput>;
};
export type AccountUpdateWithoutVendorPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUpdateManyWithoutAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutVendorPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    receivablePayments?: Prisma.ReceivablePaymentUncheckedUpdateManyWithoutAccountNestedInput;
};
export type AccountCreateWithoutReceivablePaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentCreateNestedManyWithoutFromAccountInput;
};
export type AccountUncheckedCreateWithoutReceivablePaymentsInput = {
    id?: string;
    code: string;
    name: string;
    category: $Enums.AccountCategory;
    subtype: $Enums.AccountSubtype;
    accountNumber?: string | null;
    openingBalance?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: Prisma.JournalEntryLineUncheckedCreateNestedManyWithoutAccountInput;
    payments?: Prisma.PaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedCreateNestedManyWithoutAccountInput;
    orderPayments?: Prisma.OrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    partOrderPayments?: Prisma.PartOrderUncheckedCreateNestedManyWithoutPaymentAccountInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedCreateNestedManyWithoutFromAccountInput;
};
export type AccountCreateOrConnectWithoutReceivablePaymentsInput = {
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateWithoutReceivablePaymentsInput, Prisma.AccountUncheckedCreateWithoutReceivablePaymentsInput>;
};
export type AccountUpsertWithoutReceivablePaymentsInput = {
    update: Prisma.XOR<Prisma.AccountUpdateWithoutReceivablePaymentsInput, Prisma.AccountUncheckedUpdateWithoutReceivablePaymentsInput>;
    create: Prisma.XOR<Prisma.AccountCreateWithoutReceivablePaymentsInput, Prisma.AccountUncheckedCreateWithoutReceivablePaymentsInput>;
    where?: Prisma.AccountWhereInput;
};
export type AccountUpdateToOneWithWhereWithoutReceivablePaymentsInput = {
    where?: Prisma.AccountWhereInput;
    data: Prisma.XOR<Prisma.AccountUpdateWithoutReceivablePaymentsInput, Prisma.AccountUncheckedUpdateWithoutReceivablePaymentsInput>;
};
export type AccountUpdateWithoutReceivablePaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUpdateManyWithoutFromAccountNestedInput;
};
export type AccountUncheckedUpdateWithoutReceivablePaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumAccountCategoryFieldUpdateOperationsInput | $Enums.AccountCategory;
    subtype?: Prisma.EnumAccountSubtypeFieldUpdateOperationsInput | $Enums.AccountSubtype;
    accountNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    openingBalance?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lines?: Prisma.JournalEntryLineUncheckedUpdateManyWithoutAccountNestedInput;
    payments?: Prisma.PaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    partPaymentTransactions?: Prisma.PartPaymentTransactionUncheckedUpdateManyWithoutAccountNestedInput;
    orderPayments?: Prisma.OrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    partOrderPayments?: Prisma.PartOrderUncheckedUpdateManyWithoutPaymentAccountNestedInput;
    vendorPayments?: Prisma.VendorPaymentUncheckedUpdateManyWithoutFromAccountNestedInput;
};
export type AccountCountOutputType = {
    lines: number;
    payments: number;
    partPaymentTransactions: number;
    orderPayments: number;
    partOrderPayments: number;
    vendorPayments: number;
    receivablePayments: number;
};
export type AccountCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | AccountCountOutputTypeCountLinesArgs;
    payments?: boolean | AccountCountOutputTypeCountPaymentsArgs;
    partPaymentTransactions?: boolean | AccountCountOutputTypeCountPartPaymentTransactionsArgs;
    orderPayments?: boolean | AccountCountOutputTypeCountOrderPaymentsArgs;
    partOrderPayments?: boolean | AccountCountOutputTypeCountPartOrderPaymentsArgs;
    vendorPayments?: boolean | AccountCountOutputTypeCountVendorPaymentsArgs;
    receivablePayments?: boolean | AccountCountOutputTypeCountReceivablePaymentsArgs;
};
export type AccountCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountCountOutputTypeSelect<ExtArgs> | null;
};
export type AccountCountOutputTypeCountLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JournalEntryLineWhereInput;
};
export type AccountCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentTransactionWhereInput;
};
export type AccountCountOutputTypeCountPartPaymentTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartPaymentTransactionWhereInput;
};
export type AccountCountOutputTypeCountOrderPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
export type AccountCountOutputTypeCountPartOrderPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PartOrderWhereInput;
};
export type AccountCountOutputTypeCountVendorPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VendorPaymentWhereInput;
};
export type AccountCountOutputTypeCountReceivablePaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablePaymentWhereInput;
};
export type AccountSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    subtype?: boolean;
    accountNumber?: boolean;
    openingBalance?: boolean;
    isActive?: boolean;
    isSystem?: boolean;
    lines?: boolean | Prisma.Account$linesArgs<ExtArgs>;
    payments?: boolean | Prisma.Account$paymentsArgs<ExtArgs>;
    partPaymentTransactions?: boolean | Prisma.Account$partPaymentTransactionsArgs<ExtArgs>;
    orderPayments?: boolean | Prisma.Account$orderPaymentsArgs<ExtArgs>;
    partOrderPayments?: boolean | Prisma.Account$partOrderPaymentsArgs<ExtArgs>;
    vendorPayments?: boolean | Prisma.Account$vendorPaymentsArgs<ExtArgs>;
    receivablePayments?: boolean | Prisma.Account$receivablePaymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.AccountCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["account"]>;
export type AccountSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    subtype?: boolean;
    accountNumber?: boolean;
    openingBalance?: boolean;
    isActive?: boolean;
    isSystem?: boolean;
}, ExtArgs["result"]["account"]>;
export type AccountSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    subtype?: boolean;
    accountNumber?: boolean;
    openingBalance?: boolean;
    isActive?: boolean;
    isSystem?: boolean;
}, ExtArgs["result"]["account"]>;
export type AccountSelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    subtype?: boolean;
    accountNumber?: boolean;
    openingBalance?: boolean;
    isActive?: boolean;
    isSystem?: boolean;
};
export type AccountOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "category" | "subtype" | "accountNumber" | "openingBalance" | "isActive" | "isSystem", ExtArgs["result"]["account"]>;
export type AccountInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lines?: boolean | Prisma.Account$linesArgs<ExtArgs>;
    payments?: boolean | Prisma.Account$paymentsArgs<ExtArgs>;
    partPaymentTransactions?: boolean | Prisma.Account$partPaymentTransactionsArgs<ExtArgs>;
    orderPayments?: boolean | Prisma.Account$orderPaymentsArgs<ExtArgs>;
    partOrderPayments?: boolean | Prisma.Account$partOrderPaymentsArgs<ExtArgs>;
    vendorPayments?: boolean | Prisma.Account$vendorPaymentsArgs<ExtArgs>;
    receivablePayments?: boolean | Prisma.Account$receivablePaymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.AccountCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AccountIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type AccountIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $AccountPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Account";
    objects: {
        lines: Prisma.$JournalEntryLinePayload<ExtArgs>[];
        payments: Prisma.$PaymentTransactionPayload<ExtArgs>[];
        partPaymentTransactions: Prisma.$PartPaymentTransactionPayload<ExtArgs>[];
        orderPayments: Prisma.$OrderPayload<ExtArgs>[];
        partOrderPayments: Prisma.$PartOrderPayload<ExtArgs>[];
        vendorPayments: Prisma.$VendorPaymentPayload<ExtArgs>[];
        receivablePayments: Prisma.$ReceivablePaymentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        name: string;
        category: $Enums.AccountCategory;
        subtype: $Enums.AccountSubtype;
        accountNumber: string | null;
        openingBalance: runtime.Decimal;
        isActive: boolean;
        isSystem: boolean;
    }, ExtArgs["result"]["account"]>;
    composites: {};
};
export type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AccountPayload, S>;
export type AccountCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AccountCountAggregateInputType | true;
};
export interface AccountDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Account'];
        meta: {
            name: 'Account';
        };
    };
    findUnique<T extends AccountFindUniqueArgs>(args: Prisma.SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AccountFindFirstArgs>(args?: Prisma.SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AccountFindManyArgs>(args?: Prisma.SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AccountCreateArgs>(args: Prisma.SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AccountCreateManyArgs>(args?: Prisma.SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AccountDeleteArgs>(args: Prisma.SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AccountUpdateArgs>(args: Prisma.SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AccountDeleteManyArgs>(args?: Prisma.SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AccountUpdateManyArgs>(args: Prisma.SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AccountUpsertArgs>(args: Prisma.SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma.Prisma__AccountClient<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AccountCountArgs>(args?: Prisma.Subset<T, AccountCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AccountCountAggregateOutputType> : number>;
    aggregate<T extends AccountAggregateArgs>(args: Prisma.Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>;
    groupBy<T extends AccountGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AccountGroupByArgs['orderBy'];
    } : {
        orderBy?: AccountGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AccountFieldRefs;
}
export interface Prisma__AccountClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lines<T extends Prisma.Account$linesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$linesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JournalEntryLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.Account$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    partPaymentTransactions<T extends Prisma.Account$partPaymentTransactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$partPaymentTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartPaymentTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orderPayments<T extends Prisma.Account$orderPaymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$orderPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    partOrderPayments<T extends Prisma.Account$partOrderPaymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$partOrderPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PartOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vendorPayments<T extends Prisma.Account$vendorPaymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$vendorPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VendorPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    receivablePayments<T extends Prisma.Account$receivablePaymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Account$receivablePaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablePaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AccountFieldRefs {
    readonly id: Prisma.FieldRef<"Account", 'String'>;
    readonly code: Prisma.FieldRef<"Account", 'String'>;
    readonly name: Prisma.FieldRef<"Account", 'String'>;
    readonly category: Prisma.FieldRef<"Account", 'AccountCategory'>;
    readonly subtype: Prisma.FieldRef<"Account", 'AccountSubtype'>;
    readonly accountNumber: Prisma.FieldRef<"Account", 'String'>;
    readonly openingBalance: Prisma.FieldRef<"Account", 'Decimal'>;
    readonly isActive: Prisma.FieldRef<"Account", 'Boolean'>;
    readonly isSystem: Prisma.FieldRef<"Account", 'Boolean'>;
}
export type AccountFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AccountScalarFieldEnum | Prisma.AccountScalarFieldEnum[];
};
export type AccountFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AccountScalarFieldEnum | Prisma.AccountScalarFieldEnum[];
};
export type AccountFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AccountScalarFieldEnum | Prisma.AccountScalarFieldEnum[];
};
export type AccountCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AccountCreateInput, Prisma.AccountUncheckedCreateInput>;
};
export type AccountCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AccountCreateManyInput | Prisma.AccountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AccountCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    data: Prisma.AccountCreateManyInput | Prisma.AccountCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AccountUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AccountUpdateInput, Prisma.AccountUncheckedUpdateInput>;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AccountUpdateManyMutationInput, Prisma.AccountUncheckedUpdateManyInput>;
    where?: Prisma.AccountWhereInput;
    limit?: number;
};
export type AccountUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AccountUpdateManyMutationInput, Prisma.AccountUncheckedUpdateManyInput>;
    where?: Prisma.AccountWhereInput;
    limit?: number;
};
export type AccountUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
    create: Prisma.XOR<Prisma.AccountCreateInput, Prisma.AccountUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AccountUpdateInput, Prisma.AccountUncheckedUpdateInput>;
};
export type AccountDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where: Prisma.AccountWhereUniqueInput;
};
export type AccountDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
    limit?: number;
};
export type Account$linesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.JournalEntryLineSelect<ExtArgs> | null;
    omit?: Prisma.JournalEntryLineOmit<ExtArgs> | null;
    include?: Prisma.JournalEntryLineInclude<ExtArgs> | null;
    where?: Prisma.JournalEntryLineWhereInput;
    orderBy?: Prisma.JournalEntryLineOrderByWithRelationInput | Prisma.JournalEntryLineOrderByWithRelationInput[];
    cursor?: Prisma.JournalEntryLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.JournalEntryLineScalarFieldEnum | Prisma.JournalEntryLineScalarFieldEnum[];
};
export type Account$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentTransactionSelect<ExtArgs> | null;
    omit?: Prisma.PaymentTransactionOmit<ExtArgs> | null;
    include?: Prisma.PaymentTransactionInclude<ExtArgs> | null;
    where?: Prisma.PaymentTransactionWhereInput;
    orderBy?: Prisma.PaymentTransactionOrderByWithRelationInput | Prisma.PaymentTransactionOrderByWithRelationInput[];
    cursor?: Prisma.PaymentTransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentTransactionScalarFieldEnum | Prisma.PaymentTransactionScalarFieldEnum[];
};
export type Account$partPaymentTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Account$orderPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Account$partOrderPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Account$vendorPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Account$receivablePaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablePaymentSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablePaymentOmit<ExtArgs> | null;
    include?: Prisma.ReceivablePaymentInclude<ExtArgs> | null;
    where?: Prisma.ReceivablePaymentWhereInput;
    orderBy?: Prisma.ReceivablePaymentOrderByWithRelationInput | Prisma.ReceivablePaymentOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablePaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablePaymentScalarFieldEnum | Prisma.ReceivablePaymentScalarFieldEnum[];
};
export type AccountDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AccountSelect<ExtArgs> | null;
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    include?: Prisma.AccountInclude<ExtArgs> | null;
};
