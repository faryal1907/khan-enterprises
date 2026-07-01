import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type ReceivablesAlertModel = runtime.Types.Result.DefaultSelection<Prisma.$ReceivablesAlertPayload>;
export type AggregateReceivablesAlert = {
    _count: ReceivablesAlertCountAggregateOutputType | null;
    _avg: ReceivablesAlertAvgAggregateOutputType | null;
    _sum: ReceivablesAlertSumAggregateOutputType | null;
    _min: ReceivablesAlertMinAggregateOutputType | null;
    _max: ReceivablesAlertMaxAggregateOutputType | null;
};
export type ReceivablesAlertAvgAggregateOutputType = {
    notificationCount: number | null;
    outstandingAmount: runtime.Decimal | null;
};
export type ReceivablesAlertSumAggregateOutputType = {
    notificationCount: number | null;
    outstandingAmount: runtime.Decimal | null;
};
export type ReceivablesAlertMinAggregateOutputType = {
    id: string | null;
    customerPhone: string | null;
    customerName: string | null;
    lastNotifiedAt: Date | null;
    notificationCount: number | null;
    outstandingAmount: runtime.Decimal | null;
    status: $Enums.PaymentState | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReceivablesAlertMaxAggregateOutputType = {
    id: string | null;
    customerPhone: string | null;
    customerName: string | null;
    lastNotifiedAt: Date | null;
    notificationCount: number | null;
    outstandingAmount: runtime.Decimal | null;
    status: $Enums.PaymentState | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReceivablesAlertCountAggregateOutputType = {
    id: number;
    customerPhone: number;
    customerName: number;
    lastNotifiedAt: number;
    notificationCount: number;
    outstandingAmount: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ReceivablesAlertAvgAggregateInputType = {
    notificationCount?: true;
    outstandingAmount?: true;
};
export type ReceivablesAlertSumAggregateInputType = {
    notificationCount?: true;
    outstandingAmount?: true;
};
export type ReceivablesAlertMinAggregateInputType = {
    id?: true;
    customerPhone?: true;
    customerName?: true;
    lastNotifiedAt?: true;
    notificationCount?: true;
    outstandingAmount?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReceivablesAlertMaxAggregateInputType = {
    id?: true;
    customerPhone?: true;
    customerName?: true;
    lastNotifiedAt?: true;
    notificationCount?: true;
    outstandingAmount?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReceivablesAlertCountAggregateInputType = {
    id?: true;
    customerPhone?: true;
    customerName?: true;
    lastNotifiedAt?: true;
    notificationCount?: true;
    outstandingAmount?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ReceivablesAlertAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablesAlertWhereInput;
    orderBy?: Prisma.ReceivablesAlertOrderByWithRelationInput | Prisma.ReceivablesAlertOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablesAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReceivablesAlertCountAggregateInputType;
    _avg?: ReceivablesAlertAvgAggregateInputType;
    _sum?: ReceivablesAlertSumAggregateInputType;
    _min?: ReceivablesAlertMinAggregateInputType;
    _max?: ReceivablesAlertMaxAggregateInputType;
};
export type GetReceivablesAlertAggregateType<T extends ReceivablesAlertAggregateArgs> = {
    [P in keyof T & keyof AggregateReceivablesAlert]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReceivablesAlert[P]> : Prisma.GetScalarType<T[P], AggregateReceivablesAlert[P]>;
};
export type ReceivablesAlertGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablesAlertWhereInput;
    orderBy?: Prisma.ReceivablesAlertOrderByWithAggregationInput | Prisma.ReceivablesAlertOrderByWithAggregationInput[];
    by: Prisma.ReceivablesAlertScalarFieldEnum[] | Prisma.ReceivablesAlertScalarFieldEnum;
    having?: Prisma.ReceivablesAlertScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReceivablesAlertCountAggregateInputType | true;
    _avg?: ReceivablesAlertAvgAggregateInputType;
    _sum?: ReceivablesAlertSumAggregateInputType;
    _min?: ReceivablesAlertMinAggregateInputType;
    _max?: ReceivablesAlertMaxAggregateInputType;
};
export type ReceivablesAlertGroupByOutputType = {
    id: string;
    customerPhone: string;
    customerName: string;
    lastNotifiedAt: Date;
    notificationCount: number;
    outstandingAmount: runtime.Decimal;
    status: $Enums.PaymentState;
    createdAt: Date;
    updatedAt: Date;
    _count: ReceivablesAlertCountAggregateOutputType | null;
    _avg: ReceivablesAlertAvgAggregateOutputType | null;
    _sum: ReceivablesAlertSumAggregateOutputType | null;
    _min: ReceivablesAlertMinAggregateOutputType | null;
    _max: ReceivablesAlertMaxAggregateOutputType | null;
};
export type GetReceivablesAlertGroupByPayload<T extends ReceivablesAlertGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReceivablesAlertGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReceivablesAlertGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReceivablesAlertGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReceivablesAlertGroupByOutputType[P]>;
}>>;
export type ReceivablesAlertWhereInput = {
    AND?: Prisma.ReceivablesAlertWhereInput | Prisma.ReceivablesAlertWhereInput[];
    OR?: Prisma.ReceivablesAlertWhereInput[];
    NOT?: Prisma.ReceivablesAlertWhereInput | Prisma.ReceivablesAlertWhereInput[];
    id?: Prisma.StringFilter<"ReceivablesAlert"> | string;
    customerPhone?: Prisma.StringFilter<"ReceivablesAlert"> | string;
    customerName?: Prisma.StringFilter<"ReceivablesAlert"> | string;
    lastNotifiedAt?: Prisma.DateTimeFilter<"ReceivablesAlert"> | Date | string;
    notificationCount?: Prisma.IntFilter<"ReceivablesAlert"> | number;
    outstandingAmount?: Prisma.DecimalFilter<"ReceivablesAlert"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFilter<"ReceivablesAlert"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFilter<"ReceivablesAlert"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivablesAlert"> | Date | string;
};
export type ReceivablesAlertOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    lastNotifiedAt?: Prisma.SortOrder;
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablesAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    customerPhone?: string;
    AND?: Prisma.ReceivablesAlertWhereInput | Prisma.ReceivablesAlertWhereInput[];
    OR?: Prisma.ReceivablesAlertWhereInput[];
    NOT?: Prisma.ReceivablesAlertWhereInput | Prisma.ReceivablesAlertWhereInput[];
    customerName?: Prisma.StringFilter<"ReceivablesAlert"> | string;
    lastNotifiedAt?: Prisma.DateTimeFilter<"ReceivablesAlert"> | Date | string;
    notificationCount?: Prisma.IntFilter<"ReceivablesAlert"> | number;
    outstandingAmount?: Prisma.DecimalFilter<"ReceivablesAlert"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFilter<"ReceivablesAlert"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFilter<"ReceivablesAlert"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ReceivablesAlert"> | Date | string;
}, "id" | "customerPhone">;
export type ReceivablesAlertOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    lastNotifiedAt?: Prisma.SortOrder;
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ReceivablesAlertCountOrderByAggregateInput;
    _avg?: Prisma.ReceivablesAlertAvgOrderByAggregateInput;
    _max?: Prisma.ReceivablesAlertMaxOrderByAggregateInput;
    _min?: Prisma.ReceivablesAlertMinOrderByAggregateInput;
    _sum?: Prisma.ReceivablesAlertSumOrderByAggregateInput;
};
export type ReceivablesAlertScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReceivablesAlertScalarWhereWithAggregatesInput | Prisma.ReceivablesAlertScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReceivablesAlertScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReceivablesAlertScalarWhereWithAggregatesInput | Prisma.ReceivablesAlertScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ReceivablesAlert"> | string;
    customerPhone?: Prisma.StringWithAggregatesFilter<"ReceivablesAlert"> | string;
    customerName?: Prisma.StringWithAggregatesFilter<"ReceivablesAlert"> | string;
    lastNotifiedAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivablesAlert"> | Date | string;
    notificationCount?: Prisma.IntWithAggregatesFilter<"ReceivablesAlert"> | number;
    outstandingAmount?: Prisma.DecimalWithAggregatesFilter<"ReceivablesAlert"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateWithAggregatesFilter<"ReceivablesAlert"> | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivablesAlert"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ReceivablesAlert"> | Date | string;
};
export type ReceivablesAlertCreateInput = {
    id?: string;
    customerPhone: string;
    customerName: string;
    lastNotifiedAt?: Date | string;
    notificationCount?: number;
    outstandingAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivablesAlertUncheckedCreateInput = {
    id?: string;
    customerPhone: string;
    customerName: string;
    lastNotifiedAt?: Date | string;
    notificationCount?: number;
    outstandingAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivablesAlertUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastNotifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notificationCount?: Prisma.IntFieldUpdateOperationsInput | number;
    outstandingAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablesAlertUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastNotifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notificationCount?: Prisma.IntFieldUpdateOperationsInput | number;
    outstandingAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablesAlertCreateManyInput = {
    id?: string;
    customerPhone: string;
    customerName: string;
    lastNotifiedAt?: Date | string;
    notificationCount?: number;
    outstandingAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status: $Enums.PaymentState;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReceivablesAlertUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastNotifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notificationCount?: Prisma.IntFieldUpdateOperationsInput | number;
    outstandingAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablesAlertUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastNotifiedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notificationCount?: Prisma.IntFieldUpdateOperationsInput | number;
    outstandingAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumPaymentStateFieldUpdateOperationsInput | $Enums.PaymentState;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceivablesAlertCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    lastNotifiedAt?: Prisma.SortOrder;
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablesAlertAvgOrderByAggregateInput = {
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
};
export type ReceivablesAlertMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    lastNotifiedAt?: Prisma.SortOrder;
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablesAlertMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    lastNotifiedAt?: Prisma.SortOrder;
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReceivablesAlertSumOrderByAggregateInput = {
    notificationCount?: Prisma.SortOrder;
    outstandingAmount?: Prisma.SortOrder;
};
export type ReceivablesAlertSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerPhone?: boolean;
    customerName?: boolean;
    lastNotifiedAt?: boolean;
    notificationCount?: boolean;
    outstandingAmount?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["receivablesAlert"]>;
export type ReceivablesAlertSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerPhone?: boolean;
    customerName?: boolean;
    lastNotifiedAt?: boolean;
    notificationCount?: boolean;
    outstandingAmount?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["receivablesAlert"]>;
export type ReceivablesAlertSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerPhone?: boolean;
    customerName?: boolean;
    lastNotifiedAt?: boolean;
    notificationCount?: boolean;
    outstandingAmount?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["receivablesAlert"]>;
export type ReceivablesAlertSelectScalar = {
    id?: boolean;
    customerPhone?: boolean;
    customerName?: boolean;
    lastNotifiedAt?: boolean;
    notificationCount?: boolean;
    outstandingAmount?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ReceivablesAlertOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerPhone" | "customerName" | "lastNotifiedAt" | "notificationCount" | "outstandingAmount" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["receivablesAlert"]>;
export type $ReceivablesAlertPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReceivablesAlert";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerPhone: string;
        customerName: string;
        lastNotifiedAt: Date;
        notificationCount: number;
        outstandingAmount: runtime.Decimal;
        status: $Enums.PaymentState;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["receivablesAlert"]>;
    composites: {};
};
export type ReceivablesAlertGetPayload<S extends boolean | null | undefined | ReceivablesAlertDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload, S>;
export type ReceivablesAlertCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReceivablesAlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReceivablesAlertCountAggregateInputType | true;
};
export interface ReceivablesAlertDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReceivablesAlert'];
        meta: {
            name: 'ReceivablesAlert';
        };
    };
    findUnique<T extends ReceivablesAlertFindUniqueArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReceivablesAlertFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReceivablesAlertFindFirstArgs>(args?: Prisma.SelectSubset<T, ReceivablesAlertFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReceivablesAlertFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReceivablesAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReceivablesAlertFindManyArgs>(args?: Prisma.SelectSubset<T, ReceivablesAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReceivablesAlertCreateArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertCreateArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReceivablesAlertCreateManyArgs>(args?: Prisma.SelectSubset<T, ReceivablesAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReceivablesAlertCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReceivablesAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReceivablesAlertDeleteArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertDeleteArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReceivablesAlertUpdateArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertUpdateArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReceivablesAlertDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReceivablesAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReceivablesAlertUpdateManyArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReceivablesAlertUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReceivablesAlertUpsertArgs>(args: Prisma.SelectSubset<T, ReceivablesAlertUpsertArgs<ExtArgs>>): Prisma.Prisma__ReceivablesAlertClient<runtime.Types.Result.GetResult<Prisma.$ReceivablesAlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReceivablesAlertCountArgs>(args?: Prisma.Subset<T, ReceivablesAlertCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReceivablesAlertCountAggregateOutputType> : number>;
    aggregate<T extends ReceivablesAlertAggregateArgs>(args: Prisma.Subset<T, ReceivablesAlertAggregateArgs>): Prisma.PrismaPromise<GetReceivablesAlertAggregateType<T>>;
    groupBy<T extends ReceivablesAlertGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReceivablesAlertGroupByArgs['orderBy'];
    } : {
        orderBy?: ReceivablesAlertGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReceivablesAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceivablesAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReceivablesAlertFieldRefs;
}
export interface Prisma__ReceivablesAlertClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReceivablesAlertFieldRefs {
    readonly id: Prisma.FieldRef<"ReceivablesAlert", 'String'>;
    readonly customerPhone: Prisma.FieldRef<"ReceivablesAlert", 'String'>;
    readonly customerName: Prisma.FieldRef<"ReceivablesAlert", 'String'>;
    readonly lastNotifiedAt: Prisma.FieldRef<"ReceivablesAlert", 'DateTime'>;
    readonly notificationCount: Prisma.FieldRef<"ReceivablesAlert", 'Int'>;
    readonly outstandingAmount: Prisma.FieldRef<"ReceivablesAlert", 'Decimal'>;
    readonly status: Prisma.FieldRef<"ReceivablesAlert", 'PaymentState'>;
    readonly createdAt: Prisma.FieldRef<"ReceivablesAlert", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ReceivablesAlert", 'DateTime'>;
}
export type ReceivablesAlertFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where: Prisma.ReceivablesAlertWhereUniqueInput;
};
export type ReceivablesAlertFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where: Prisma.ReceivablesAlertWhereUniqueInput;
};
export type ReceivablesAlertFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where?: Prisma.ReceivablesAlertWhereInput;
    orderBy?: Prisma.ReceivablesAlertOrderByWithRelationInput | Prisma.ReceivablesAlertOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablesAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablesAlertScalarFieldEnum | Prisma.ReceivablesAlertScalarFieldEnum[];
};
export type ReceivablesAlertFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where?: Prisma.ReceivablesAlertWhereInput;
    orderBy?: Prisma.ReceivablesAlertOrderByWithRelationInput | Prisma.ReceivablesAlertOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablesAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablesAlertScalarFieldEnum | Prisma.ReceivablesAlertScalarFieldEnum[];
};
export type ReceivablesAlertFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where?: Prisma.ReceivablesAlertWhereInput;
    orderBy?: Prisma.ReceivablesAlertOrderByWithRelationInput | Prisma.ReceivablesAlertOrderByWithRelationInput[];
    cursor?: Prisma.ReceivablesAlertWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceivablesAlertScalarFieldEnum | Prisma.ReceivablesAlertScalarFieldEnum[];
};
export type ReceivablesAlertCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablesAlertCreateInput, Prisma.ReceivablesAlertUncheckedCreateInput>;
};
export type ReceivablesAlertCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReceivablesAlertCreateManyInput | Prisma.ReceivablesAlertCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceivablesAlertCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    data: Prisma.ReceivablesAlertCreateManyInput | Prisma.ReceivablesAlertCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceivablesAlertUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablesAlertUpdateInput, Prisma.ReceivablesAlertUncheckedUpdateInput>;
    where: Prisma.ReceivablesAlertWhereUniqueInput;
};
export type ReceivablesAlertUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReceivablesAlertUpdateManyMutationInput, Prisma.ReceivablesAlertUncheckedUpdateManyInput>;
    where?: Prisma.ReceivablesAlertWhereInput;
    limit?: number;
};
export type ReceivablesAlertUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceivablesAlertUpdateManyMutationInput, Prisma.ReceivablesAlertUncheckedUpdateManyInput>;
    where?: Prisma.ReceivablesAlertWhereInput;
    limit?: number;
};
export type ReceivablesAlertUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where: Prisma.ReceivablesAlertWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceivablesAlertCreateInput, Prisma.ReceivablesAlertUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReceivablesAlertUpdateInput, Prisma.ReceivablesAlertUncheckedUpdateInput>;
};
export type ReceivablesAlertDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
    where: Prisma.ReceivablesAlertWhereUniqueInput;
};
export type ReceivablesAlertDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceivablesAlertWhereInput;
    limit?: number;
};
export type ReceivablesAlertDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceivablesAlertSelect<ExtArgs> | null;
    omit?: Prisma.ReceivablesAlertOmit<ExtArgs> | null;
};
