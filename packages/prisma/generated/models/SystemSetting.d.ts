import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type SystemSettingModel = runtime.Types.Result.DefaultSelection<Prisma.$SystemSettingPayload>;
export type AggregateSystemSetting = {
    _count: SystemSettingCountAggregateOutputType | null;
    _min: SystemSettingMinAggregateOutputType | null;
    _max: SystemSettingMaxAggregateOutputType | null;
};
export type SystemSettingMinAggregateOutputType = {
    id: string | null;
    key: string | null;
    value: string | null;
    updatedAt: Date | null;
};
export type SystemSettingMaxAggregateOutputType = {
    id: string | null;
    key: string | null;
    value: string | null;
    updatedAt: Date | null;
};
export type SystemSettingCountAggregateOutputType = {
    id: number;
    key: number;
    value: number;
    updatedAt: number;
    _all: number;
};
export type SystemSettingMinAggregateInputType = {
    id?: true;
    key?: true;
    value?: true;
    updatedAt?: true;
};
export type SystemSettingMaxAggregateInputType = {
    id?: true;
    key?: true;
    value?: true;
    updatedAt?: true;
};
export type SystemSettingCountAggregateInputType = {
    id?: true;
    key?: true;
    value?: true;
    updatedAt?: true;
    _all?: true;
};
export type SystemSettingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SystemSettingWhereInput;
    orderBy?: Prisma.SystemSettingOrderByWithRelationInput | Prisma.SystemSettingOrderByWithRelationInput[];
    cursor?: Prisma.SystemSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SystemSettingCountAggregateInputType;
    _min?: SystemSettingMinAggregateInputType;
    _max?: SystemSettingMaxAggregateInputType;
};
export type GetSystemSettingAggregateType<T extends SystemSettingAggregateArgs> = {
    [P in keyof T & keyof AggregateSystemSetting]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSystemSetting[P]> : Prisma.GetScalarType<T[P], AggregateSystemSetting[P]>;
};
export type SystemSettingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SystemSettingWhereInput;
    orderBy?: Prisma.SystemSettingOrderByWithAggregationInput | Prisma.SystemSettingOrderByWithAggregationInput[];
    by: Prisma.SystemSettingScalarFieldEnum[] | Prisma.SystemSettingScalarFieldEnum;
    having?: Prisma.SystemSettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SystemSettingCountAggregateInputType | true;
    _min?: SystemSettingMinAggregateInputType;
    _max?: SystemSettingMaxAggregateInputType;
};
export type SystemSettingGroupByOutputType = {
    id: string;
    key: string;
    value: string;
    updatedAt: Date;
    _count: SystemSettingCountAggregateOutputType | null;
    _min: SystemSettingMinAggregateOutputType | null;
    _max: SystemSettingMaxAggregateOutputType | null;
};
export type GetSystemSettingGroupByPayload<T extends SystemSettingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SystemSettingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SystemSettingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SystemSettingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SystemSettingGroupByOutputType[P]>;
}>>;
export type SystemSettingWhereInput = {
    AND?: Prisma.SystemSettingWhereInput | Prisma.SystemSettingWhereInput[];
    OR?: Prisma.SystemSettingWhereInput[];
    NOT?: Prisma.SystemSettingWhereInput | Prisma.SystemSettingWhereInput[];
    id?: Prisma.StringFilter<"SystemSetting"> | string;
    key?: Prisma.StringFilter<"SystemSetting"> | string;
    value?: Prisma.StringFilter<"SystemSetting"> | string;
    updatedAt?: Prisma.DateTimeFilter<"SystemSetting"> | Date | string;
};
export type SystemSettingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SystemSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    key?: string;
    AND?: Prisma.SystemSettingWhereInput | Prisma.SystemSettingWhereInput[];
    OR?: Prisma.SystemSettingWhereInput[];
    NOT?: Prisma.SystemSettingWhereInput | Prisma.SystemSettingWhereInput[];
    value?: Prisma.StringFilter<"SystemSetting"> | string;
    updatedAt?: Prisma.DateTimeFilter<"SystemSetting"> | Date | string;
}, "id" | "key">;
export type SystemSettingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SystemSettingCountOrderByAggregateInput;
    _max?: Prisma.SystemSettingMaxOrderByAggregateInput;
    _min?: Prisma.SystemSettingMinOrderByAggregateInput;
};
export type SystemSettingScalarWhereWithAggregatesInput = {
    AND?: Prisma.SystemSettingScalarWhereWithAggregatesInput | Prisma.SystemSettingScalarWhereWithAggregatesInput[];
    OR?: Prisma.SystemSettingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SystemSettingScalarWhereWithAggregatesInput | Prisma.SystemSettingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SystemSetting"> | string;
    key?: Prisma.StringWithAggregatesFilter<"SystemSetting"> | string;
    value?: Prisma.StringWithAggregatesFilter<"SystemSetting"> | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"SystemSetting"> | Date | string;
};
export type SystemSettingCreateInput = {
    id?: string;
    key: string;
    value: string;
    updatedAt?: Date | string;
};
export type SystemSettingUncheckedCreateInput = {
    id?: string;
    key: string;
    value: string;
    updatedAt?: Date | string;
};
export type SystemSettingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemSettingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemSettingCreateManyInput = {
    id?: string;
    key: string;
    value: string;
    updatedAt?: Date | string;
};
export type SystemSettingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemSettingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemSettingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SystemSettingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SystemSettingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SystemSettingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    value?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["systemSetting"]>;
export type SystemSettingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    value?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["systemSetting"]>;
export type SystemSettingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    value?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["systemSetting"]>;
export type SystemSettingSelectScalar = {
    id?: boolean;
    key?: boolean;
    value?: boolean;
    updatedAt?: boolean;
};
export type SystemSettingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "key" | "value" | "updatedAt", ExtArgs["result"]["systemSetting"]>;
export type $SystemSettingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SystemSetting";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        key: string;
        value: string;
        updatedAt: Date;
    }, ExtArgs["result"]["systemSetting"]>;
    composites: {};
};
export type SystemSettingGetPayload<S extends boolean | null | undefined | SystemSettingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload, S>;
export type SystemSettingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SystemSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SystemSettingCountAggregateInputType | true;
};
export interface SystemSettingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SystemSetting'];
        meta: {
            name: 'SystemSetting';
        };
    };
    findUnique<T extends SystemSettingFindUniqueArgs>(args: Prisma.SelectSubset<T, SystemSettingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SystemSettingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SystemSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SystemSettingFindFirstArgs>(args?: Prisma.SelectSubset<T, SystemSettingFindFirstArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SystemSettingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SystemSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SystemSettingFindManyArgs>(args?: Prisma.SelectSubset<T, SystemSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SystemSettingCreateArgs>(args: Prisma.SelectSubset<T, SystemSettingCreateArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SystemSettingCreateManyArgs>(args?: Prisma.SelectSubset<T, SystemSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SystemSettingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SystemSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SystemSettingDeleteArgs>(args: Prisma.SelectSubset<T, SystemSettingDeleteArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SystemSettingUpdateArgs>(args: Prisma.SelectSubset<T, SystemSettingUpdateArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SystemSettingDeleteManyArgs>(args?: Prisma.SelectSubset<T, SystemSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SystemSettingUpdateManyArgs>(args: Prisma.SelectSubset<T, SystemSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SystemSettingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SystemSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SystemSettingUpsertArgs>(args: Prisma.SelectSubset<T, SystemSettingUpsertArgs<ExtArgs>>): Prisma.Prisma__SystemSettingClient<runtime.Types.Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SystemSettingCountArgs>(args?: Prisma.Subset<T, SystemSettingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SystemSettingCountAggregateOutputType> : number>;
    aggregate<T extends SystemSettingAggregateArgs>(args: Prisma.Subset<T, SystemSettingAggregateArgs>): Prisma.PrismaPromise<GetSystemSettingAggregateType<T>>;
    groupBy<T extends SystemSettingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SystemSettingGroupByArgs['orderBy'];
    } : {
        orderBy?: SystemSettingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SystemSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SystemSettingFieldRefs;
}
export interface Prisma__SystemSettingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SystemSettingFieldRefs {
    readonly id: Prisma.FieldRef<"SystemSetting", 'String'>;
    readonly key: Prisma.FieldRef<"SystemSetting", 'String'>;
    readonly value: Prisma.FieldRef<"SystemSetting", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"SystemSetting", 'DateTime'>;
}
export type SystemSettingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where: Prisma.SystemSettingWhereUniqueInput;
};
export type SystemSettingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where: Prisma.SystemSettingWhereUniqueInput;
};
export type SystemSettingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where?: Prisma.SystemSettingWhereInput;
    orderBy?: Prisma.SystemSettingOrderByWithRelationInput | Prisma.SystemSettingOrderByWithRelationInput[];
    cursor?: Prisma.SystemSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SystemSettingScalarFieldEnum | Prisma.SystemSettingScalarFieldEnum[];
};
export type SystemSettingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where?: Prisma.SystemSettingWhereInput;
    orderBy?: Prisma.SystemSettingOrderByWithRelationInput | Prisma.SystemSettingOrderByWithRelationInput[];
    cursor?: Prisma.SystemSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SystemSettingScalarFieldEnum | Prisma.SystemSettingScalarFieldEnum[];
};
export type SystemSettingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where?: Prisma.SystemSettingWhereInput;
    orderBy?: Prisma.SystemSettingOrderByWithRelationInput | Prisma.SystemSettingOrderByWithRelationInput[];
    cursor?: Prisma.SystemSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SystemSettingScalarFieldEnum | Prisma.SystemSettingScalarFieldEnum[];
};
export type SystemSettingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SystemSettingCreateInput, Prisma.SystemSettingUncheckedCreateInput>;
};
export type SystemSettingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SystemSettingCreateManyInput | Prisma.SystemSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SystemSettingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    data: Prisma.SystemSettingCreateManyInput | Prisma.SystemSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SystemSettingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SystemSettingUpdateInput, Prisma.SystemSettingUncheckedUpdateInput>;
    where: Prisma.SystemSettingWhereUniqueInput;
};
export type SystemSettingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SystemSettingUpdateManyMutationInput, Prisma.SystemSettingUncheckedUpdateManyInput>;
    where?: Prisma.SystemSettingWhereInput;
    limit?: number;
};
export type SystemSettingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SystemSettingUpdateManyMutationInput, Prisma.SystemSettingUncheckedUpdateManyInput>;
    where?: Prisma.SystemSettingWhereInput;
    limit?: number;
};
export type SystemSettingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where: Prisma.SystemSettingWhereUniqueInput;
    create: Prisma.XOR<Prisma.SystemSettingCreateInput, Prisma.SystemSettingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SystemSettingUpdateInput, Prisma.SystemSettingUncheckedUpdateInput>;
};
export type SystemSettingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
    where: Prisma.SystemSettingWhereUniqueInput;
};
export type SystemSettingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SystemSettingWhereInput;
    limit?: number;
};
export type SystemSettingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemSettingSelect<ExtArgs> | null;
    omit?: Prisma.SystemSettingOmit<ExtArgs> | null;
};
