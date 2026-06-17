import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type DeliveryPricingModel = runtime.Types.Result.DefaultSelection<Prisma.$DeliveryPricingPayload>;
export type AggregateDeliveryPricing = {
    _count: DeliveryPricingCountAggregateOutputType | null;
    _avg: DeliveryPricingAvgAggregateOutputType | null;
    _sum: DeliveryPricingSumAggregateOutputType | null;
    _min: DeliveryPricingMinAggregateOutputType | null;
    _max: DeliveryPricingMaxAggregateOutputType | null;
};
export type DeliveryPricingAvgAggregateOutputType = {
    freeDistanceKm: number | null;
    ratePerKm: runtime.Decimal | null;
    ratePerKg: runtime.Decimal | null;
};
export type DeliveryPricingSumAggregateOutputType = {
    freeDistanceKm: number | null;
    ratePerKm: runtime.Decimal | null;
    ratePerKg: runtime.Decimal | null;
};
export type DeliveryPricingMinAggregateOutputType = {
    id: string | null;
    freeDistanceKm: number | null;
    ratePerKm: runtime.Decimal | null;
    ratePerKg: runtime.Decimal | null;
    effectiveFrom: Date | null;
    effectiveTo: Date | null;
};
export type DeliveryPricingMaxAggregateOutputType = {
    id: string | null;
    freeDistanceKm: number | null;
    ratePerKm: runtime.Decimal | null;
    ratePerKg: runtime.Decimal | null;
    effectiveFrom: Date | null;
    effectiveTo: Date | null;
};
export type DeliveryPricingCountAggregateOutputType = {
    id: number;
    freeDistanceKm: number;
    ratePerKm: number;
    ratePerKg: number;
    effectiveFrom: number;
    effectiveTo: number;
    _all: number;
};
export type DeliveryPricingAvgAggregateInputType = {
    freeDistanceKm?: true;
    ratePerKm?: true;
    ratePerKg?: true;
};
export type DeliveryPricingSumAggregateInputType = {
    freeDistanceKm?: true;
    ratePerKm?: true;
    ratePerKg?: true;
};
export type DeliveryPricingMinAggregateInputType = {
    id?: true;
    freeDistanceKm?: true;
    ratePerKm?: true;
    ratePerKg?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
};
export type DeliveryPricingMaxAggregateInputType = {
    id?: true;
    freeDistanceKm?: true;
    ratePerKm?: true;
    ratePerKg?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
};
export type DeliveryPricingCountAggregateInputType = {
    id?: true;
    freeDistanceKm?: true;
    ratePerKm?: true;
    ratePerKg?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    _all?: true;
};
export type DeliveryPricingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryPricingWhereInput;
    orderBy?: Prisma.DeliveryPricingOrderByWithRelationInput | Prisma.DeliveryPricingOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DeliveryPricingCountAggregateInputType;
    _avg?: DeliveryPricingAvgAggregateInputType;
    _sum?: DeliveryPricingSumAggregateInputType;
    _min?: DeliveryPricingMinAggregateInputType;
    _max?: DeliveryPricingMaxAggregateInputType;
};
export type GetDeliveryPricingAggregateType<T extends DeliveryPricingAggregateArgs> = {
    [P in keyof T & keyof AggregateDeliveryPricing]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDeliveryPricing[P]> : Prisma.GetScalarType<T[P], AggregateDeliveryPricing[P]>;
};
export type DeliveryPricingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryPricingWhereInput;
    orderBy?: Prisma.DeliveryPricingOrderByWithAggregationInput | Prisma.DeliveryPricingOrderByWithAggregationInput[];
    by: Prisma.DeliveryPricingScalarFieldEnum[] | Prisma.DeliveryPricingScalarFieldEnum;
    having?: Prisma.DeliveryPricingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DeliveryPricingCountAggregateInputType | true;
    _avg?: DeliveryPricingAvgAggregateInputType;
    _sum?: DeliveryPricingSumAggregateInputType;
    _min?: DeliveryPricingMinAggregateInputType;
    _max?: DeliveryPricingMaxAggregateInputType;
};
export type DeliveryPricingGroupByOutputType = {
    id: string;
    freeDistanceKm: number;
    ratePerKm: runtime.Decimal;
    ratePerKg: runtime.Decimal | null;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    _count: DeliveryPricingCountAggregateOutputType | null;
    _avg: DeliveryPricingAvgAggregateOutputType | null;
    _sum: DeliveryPricingSumAggregateOutputType | null;
    _min: DeliveryPricingMinAggregateOutputType | null;
    _max: DeliveryPricingMaxAggregateOutputType | null;
};
export type GetDeliveryPricingGroupByPayload<T extends DeliveryPricingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DeliveryPricingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DeliveryPricingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DeliveryPricingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DeliveryPricingGroupByOutputType[P]>;
}>>;
export type DeliveryPricingWhereInput = {
    AND?: Prisma.DeliveryPricingWhereInput | Prisma.DeliveryPricingWhereInput[];
    OR?: Prisma.DeliveryPricingWhereInput[];
    NOT?: Prisma.DeliveryPricingWhereInput | Prisma.DeliveryPricingWhereInput[];
    id?: Prisma.StringFilter<"DeliveryPricing"> | string;
    freeDistanceKm?: Prisma.IntFilter<"DeliveryPricing"> | number;
    ratePerKm?: Prisma.DecimalFilter<"DeliveryPricing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.DecimalNullableFilter<"DeliveryPricing"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeFilter<"DeliveryPricing"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"DeliveryPricing"> | Date | string | null;
};
export type DeliveryPricingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type DeliveryPricingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DeliveryPricingWhereInput | Prisma.DeliveryPricingWhereInput[];
    OR?: Prisma.DeliveryPricingWhereInput[];
    NOT?: Prisma.DeliveryPricingWhereInput | Prisma.DeliveryPricingWhereInput[];
    freeDistanceKm?: Prisma.IntFilter<"DeliveryPricing"> | number;
    ratePerKm?: Prisma.DecimalFilter<"DeliveryPricing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.DecimalNullableFilter<"DeliveryPricing"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeFilter<"DeliveryPricing"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"DeliveryPricing"> | Date | string | null;
}, "id">;
export type DeliveryPricingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.DeliveryPricingCountOrderByAggregateInput;
    _avg?: Prisma.DeliveryPricingAvgOrderByAggregateInput;
    _max?: Prisma.DeliveryPricingMaxOrderByAggregateInput;
    _min?: Prisma.DeliveryPricingMinOrderByAggregateInput;
    _sum?: Prisma.DeliveryPricingSumOrderByAggregateInput;
};
export type DeliveryPricingScalarWhereWithAggregatesInput = {
    AND?: Prisma.DeliveryPricingScalarWhereWithAggregatesInput | Prisma.DeliveryPricingScalarWhereWithAggregatesInput[];
    OR?: Prisma.DeliveryPricingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DeliveryPricingScalarWhereWithAggregatesInput | Prisma.DeliveryPricingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DeliveryPricing"> | string;
    freeDistanceKm?: Prisma.IntWithAggregatesFilter<"DeliveryPricing"> | number;
    ratePerKm?: Prisma.DecimalWithAggregatesFilter<"DeliveryPricing"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.DecimalNullableWithAggregatesFilter<"DeliveryPricing"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeWithAggregatesFilter<"DeliveryPricing"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableWithAggregatesFilter<"DeliveryPricing"> | Date | string | null;
};
export type DeliveryPricingCreateInput = {
    id?: string;
    freeDistanceKm?: number;
    ratePerKm: runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Date | string;
    effectiveTo?: Date | string | null;
};
export type DeliveryPricingUncheckedCreateInput = {
    id?: string;
    freeDistanceKm?: number;
    ratePerKm: runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Date | string;
    effectiveTo?: Date | string | null;
};
export type DeliveryPricingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeDistanceKm?: Prisma.IntFieldUpdateOperationsInput | number;
    ratePerKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DeliveryPricingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeDistanceKm?: Prisma.IntFieldUpdateOperationsInput | number;
    ratePerKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DeliveryPricingCreateManyInput = {
    id?: string;
    freeDistanceKm?: number;
    ratePerKm: runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Date | string;
    effectiveTo?: Date | string | null;
};
export type DeliveryPricingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeDistanceKm?: Prisma.IntFieldUpdateOperationsInput | number;
    ratePerKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DeliveryPricingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeDistanceKm?: Prisma.IntFieldUpdateOperationsInput | number;
    ratePerKm?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ratePerKg?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DeliveryPricingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
};
export type DeliveryPricingAvgOrderByAggregateInput = {
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrder;
};
export type DeliveryPricingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
};
export type DeliveryPricingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
};
export type DeliveryPricingSumOrderByAggregateInput = {
    freeDistanceKm?: Prisma.SortOrder;
    ratePerKm?: Prisma.SortOrder;
    ratePerKg?: Prisma.SortOrder;
};
export type DeliveryPricingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    freeDistanceKm?: boolean;
    ratePerKm?: boolean;
    ratePerKg?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
}, ExtArgs["result"]["deliveryPricing"]>;
export type DeliveryPricingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    freeDistanceKm?: boolean;
    ratePerKm?: boolean;
    ratePerKg?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
}, ExtArgs["result"]["deliveryPricing"]>;
export type DeliveryPricingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    freeDistanceKm?: boolean;
    ratePerKm?: boolean;
    ratePerKg?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
}, ExtArgs["result"]["deliveryPricing"]>;
export type DeliveryPricingSelectScalar = {
    id?: boolean;
    freeDistanceKm?: boolean;
    ratePerKm?: boolean;
    ratePerKg?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
};
export type DeliveryPricingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "freeDistanceKm" | "ratePerKm" | "ratePerKg" | "effectiveFrom" | "effectiveTo", ExtArgs["result"]["deliveryPricing"]>;
export type $DeliveryPricingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DeliveryPricing";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        freeDistanceKm: number;
        ratePerKm: runtime.Decimal;
        ratePerKg: runtime.Decimal | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }, ExtArgs["result"]["deliveryPricing"]>;
    composites: {};
};
export type DeliveryPricingGetPayload<S extends boolean | null | undefined | DeliveryPricingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload, S>;
export type DeliveryPricingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DeliveryPricingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DeliveryPricingCountAggregateInputType | true;
};
export interface DeliveryPricingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DeliveryPricing'];
        meta: {
            name: 'DeliveryPricing';
        };
    };
    findUnique<T extends DeliveryPricingFindUniqueArgs>(args: Prisma.SelectSubset<T, DeliveryPricingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DeliveryPricingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DeliveryPricingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DeliveryPricingFindFirstArgs>(args?: Prisma.SelectSubset<T, DeliveryPricingFindFirstArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DeliveryPricingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DeliveryPricingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DeliveryPricingFindManyArgs>(args?: Prisma.SelectSubset<T, DeliveryPricingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DeliveryPricingCreateArgs>(args: Prisma.SelectSubset<T, DeliveryPricingCreateArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DeliveryPricingCreateManyArgs>(args?: Prisma.SelectSubset<T, DeliveryPricingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DeliveryPricingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DeliveryPricingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DeliveryPricingDeleteArgs>(args: Prisma.SelectSubset<T, DeliveryPricingDeleteArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DeliveryPricingUpdateArgs>(args: Prisma.SelectSubset<T, DeliveryPricingUpdateArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DeliveryPricingDeleteManyArgs>(args?: Prisma.SelectSubset<T, DeliveryPricingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DeliveryPricingUpdateManyArgs>(args: Prisma.SelectSubset<T, DeliveryPricingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DeliveryPricingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DeliveryPricingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DeliveryPricingUpsertArgs>(args: Prisma.SelectSubset<T, DeliveryPricingUpsertArgs<ExtArgs>>): Prisma.Prisma__DeliveryPricingClient<runtime.Types.Result.GetResult<Prisma.$DeliveryPricingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DeliveryPricingCountArgs>(args?: Prisma.Subset<T, DeliveryPricingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DeliveryPricingCountAggregateOutputType> : number>;
    aggregate<T extends DeliveryPricingAggregateArgs>(args: Prisma.Subset<T, DeliveryPricingAggregateArgs>): Prisma.PrismaPromise<GetDeliveryPricingAggregateType<T>>;
    groupBy<T extends DeliveryPricingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DeliveryPricingGroupByArgs['orderBy'];
    } : {
        orderBy?: DeliveryPricingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DeliveryPricingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeliveryPricingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DeliveryPricingFieldRefs;
}
export interface Prisma__DeliveryPricingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DeliveryPricingFieldRefs {
    readonly id: Prisma.FieldRef<"DeliveryPricing", 'String'>;
    readonly freeDistanceKm: Prisma.FieldRef<"DeliveryPricing", 'Int'>;
    readonly ratePerKm: Prisma.FieldRef<"DeliveryPricing", 'Decimal'>;
    readonly ratePerKg: Prisma.FieldRef<"DeliveryPricing", 'Decimal'>;
    readonly effectiveFrom: Prisma.FieldRef<"DeliveryPricing", 'DateTime'>;
    readonly effectiveTo: Prisma.FieldRef<"DeliveryPricing", 'DateTime'>;
}
export type DeliveryPricingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where: Prisma.DeliveryPricingWhereUniqueInput;
};
export type DeliveryPricingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where: Prisma.DeliveryPricingWhereUniqueInput;
};
export type DeliveryPricingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where?: Prisma.DeliveryPricingWhereInput;
    orderBy?: Prisma.DeliveryPricingOrderByWithRelationInput | Prisma.DeliveryPricingOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryPricingScalarFieldEnum | Prisma.DeliveryPricingScalarFieldEnum[];
};
export type DeliveryPricingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where?: Prisma.DeliveryPricingWhereInput;
    orderBy?: Prisma.DeliveryPricingOrderByWithRelationInput | Prisma.DeliveryPricingOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryPricingScalarFieldEnum | Prisma.DeliveryPricingScalarFieldEnum[];
};
export type DeliveryPricingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where?: Prisma.DeliveryPricingWhereInput;
    orderBy?: Prisma.DeliveryPricingOrderByWithRelationInput | Prisma.DeliveryPricingOrderByWithRelationInput[];
    cursor?: Prisma.DeliveryPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeliveryPricingScalarFieldEnum | Prisma.DeliveryPricingScalarFieldEnum[];
};
export type DeliveryPricingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeliveryPricingCreateInput, Prisma.DeliveryPricingUncheckedCreateInput>;
};
export type DeliveryPricingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DeliveryPricingCreateManyInput | Prisma.DeliveryPricingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DeliveryPricingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    data: Prisma.DeliveryPricingCreateManyInput | Prisma.DeliveryPricingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DeliveryPricingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeliveryPricingUpdateInput, Prisma.DeliveryPricingUncheckedUpdateInput>;
    where: Prisma.DeliveryPricingWhereUniqueInput;
};
export type DeliveryPricingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DeliveryPricingUpdateManyMutationInput, Prisma.DeliveryPricingUncheckedUpdateManyInput>;
    where?: Prisma.DeliveryPricingWhereInput;
    limit?: number;
};
export type DeliveryPricingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeliveryPricingUpdateManyMutationInput, Prisma.DeliveryPricingUncheckedUpdateManyInput>;
    where?: Prisma.DeliveryPricingWhereInput;
    limit?: number;
};
export type DeliveryPricingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where: Prisma.DeliveryPricingWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeliveryPricingCreateInput, Prisma.DeliveryPricingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DeliveryPricingUpdateInput, Prisma.DeliveryPricingUncheckedUpdateInput>;
};
export type DeliveryPricingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
    where: Prisma.DeliveryPricingWhereUniqueInput;
};
export type DeliveryPricingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeliveryPricingWhereInput;
    limit?: number;
};
export type DeliveryPricingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeliveryPricingSelect<ExtArgs> | null;
    omit?: Prisma.DeliveryPricingOmit<ExtArgs> | null;
};
