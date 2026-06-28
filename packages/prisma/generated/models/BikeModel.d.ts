import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type BikeModelModel = runtime.Types.Result.DefaultSelection<Prisma.$BikeModelPayload>;
export type AggregateBikeModel = {
    _count: BikeModelCountAggregateOutputType | null;
    _avg: BikeModelAvgAggregateOutputType | null;
    _sum: BikeModelSumAggregateOutputType | null;
    _min: BikeModelMinAggregateOutputType | null;
    _max: BikeModelMaxAggregateOutputType | null;
};
export type BikeModelAvgAggregateOutputType = {
    year: number | null;
    basePrice: runtime.Decimal | null;
};
export type BikeModelSumAggregateOutputType = {
    year: number | null;
    basePrice: runtime.Decimal | null;
};
export type BikeModelMinAggregateOutputType = {
    id: string | null;
    brand: string | null;
    modelName: string | null;
    year: number | null;
    engineCapacity: string | null;
    description: string | null;
    basePrice: runtime.Decimal | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BikeModelMaxAggregateOutputType = {
    id: string | null;
    brand: string | null;
    modelName: string | null;
    year: number | null;
    engineCapacity: string | null;
    description: string | null;
    basePrice: runtime.Decimal | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BikeModelCountAggregateOutputType = {
    id: number;
    brand: number;
    modelName: number;
    year: number;
    engineCapacity: number;
    colors: number;
    description: number;
    basePrice: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BikeModelAvgAggregateInputType = {
    year?: true;
    basePrice?: true;
};
export type BikeModelSumAggregateInputType = {
    year?: true;
    basePrice?: true;
};
export type BikeModelMinAggregateInputType = {
    id?: true;
    brand?: true;
    modelName?: true;
    year?: true;
    engineCapacity?: true;
    description?: true;
    basePrice?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BikeModelMaxAggregateInputType = {
    id?: true;
    brand?: true;
    modelName?: true;
    year?: true;
    engineCapacity?: true;
    description?: true;
    basePrice?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BikeModelCountAggregateInputType = {
    id?: true;
    brand?: true;
    modelName?: true;
    year?: true;
    engineCapacity?: true;
    colors?: true;
    description?: true;
    basePrice?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BikeModelAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeModelWhereInput;
    orderBy?: Prisma.BikeModelOrderByWithRelationInput | Prisma.BikeModelOrderByWithRelationInput[];
    cursor?: Prisma.BikeModelWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BikeModelCountAggregateInputType;
    _avg?: BikeModelAvgAggregateInputType;
    _sum?: BikeModelSumAggregateInputType;
    _min?: BikeModelMinAggregateInputType;
    _max?: BikeModelMaxAggregateInputType;
};
export type GetBikeModelAggregateType<T extends BikeModelAggregateArgs> = {
    [P in keyof T & keyof AggregateBikeModel]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBikeModel[P]> : Prisma.GetScalarType<T[P], AggregateBikeModel[P]>;
};
export type BikeModelGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeModelWhereInput;
    orderBy?: Prisma.BikeModelOrderByWithAggregationInput | Prisma.BikeModelOrderByWithAggregationInput[];
    by: Prisma.BikeModelScalarFieldEnum[] | Prisma.BikeModelScalarFieldEnum;
    having?: Prisma.BikeModelScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BikeModelCountAggregateInputType | true;
    _avg?: BikeModelAvgAggregateInputType;
    _sum?: BikeModelSumAggregateInputType;
    _min?: BikeModelMinAggregateInputType;
    _max?: BikeModelMaxAggregateInputType;
};
export type BikeModelGroupByOutputType = {
    id: string;
    brand: string;
    modelName: string;
    year: number;
    engineCapacity: string | null;
    colors: string[];
    description: string | null;
    basePrice: runtime.Decimal;
    createdAt: Date;
    updatedAt: Date;
    _count: BikeModelCountAggregateOutputType | null;
    _avg: BikeModelAvgAggregateOutputType | null;
    _sum: BikeModelSumAggregateOutputType | null;
    _min: BikeModelMinAggregateOutputType | null;
    _max: BikeModelMaxAggregateOutputType | null;
};
export type GetBikeModelGroupByPayload<T extends BikeModelGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BikeModelGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BikeModelGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BikeModelGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BikeModelGroupByOutputType[P]>;
}>>;
export type BikeModelWhereInput = {
    AND?: Prisma.BikeModelWhereInput | Prisma.BikeModelWhereInput[];
    OR?: Prisma.BikeModelWhereInput[];
    NOT?: Prisma.BikeModelWhereInput | Prisma.BikeModelWhereInput[];
    id?: Prisma.StringFilter<"BikeModel"> | string;
    brand?: Prisma.StringFilter<"BikeModel"> | string;
    modelName?: Prisma.StringFilter<"BikeModel"> | string;
    year?: Prisma.IntFilter<"BikeModel"> | number;
    engineCapacity?: Prisma.StringNullableFilter<"BikeModel"> | string | null;
    colors?: Prisma.StringNullableListFilter<"BikeModel">;
    description?: Prisma.StringNullableFilter<"BikeModel"> | string | null;
    basePrice?: Prisma.DecimalFilter<"BikeModel"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"BikeModel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BikeModel"> | Date | string;
    bikes?: Prisma.BikeUnitListRelationFilter;
};
export type BikeModelOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    engineCapacity?: Prisma.SortOrderInput | Prisma.SortOrder;
    colors?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    bikes?: Prisma.BikeUnitOrderByRelationAggregateInput;
};
export type BikeModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BikeModelWhereInput | Prisma.BikeModelWhereInput[];
    OR?: Prisma.BikeModelWhereInput[];
    NOT?: Prisma.BikeModelWhereInput | Prisma.BikeModelWhereInput[];
    brand?: Prisma.StringFilter<"BikeModel"> | string;
    modelName?: Prisma.StringFilter<"BikeModel"> | string;
    year?: Prisma.IntFilter<"BikeModel"> | number;
    engineCapacity?: Prisma.StringNullableFilter<"BikeModel"> | string | null;
    colors?: Prisma.StringNullableListFilter<"BikeModel">;
    description?: Prisma.StringNullableFilter<"BikeModel"> | string | null;
    basePrice?: Prisma.DecimalFilter<"BikeModel"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"BikeModel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BikeModel"> | Date | string;
    bikes?: Prisma.BikeUnitListRelationFilter;
}, "id">;
export type BikeModelOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    engineCapacity?: Prisma.SortOrderInput | Prisma.SortOrder;
    colors?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BikeModelCountOrderByAggregateInput;
    _avg?: Prisma.BikeModelAvgOrderByAggregateInput;
    _max?: Prisma.BikeModelMaxOrderByAggregateInput;
    _min?: Prisma.BikeModelMinOrderByAggregateInput;
    _sum?: Prisma.BikeModelSumOrderByAggregateInput;
};
export type BikeModelScalarWhereWithAggregatesInput = {
    AND?: Prisma.BikeModelScalarWhereWithAggregatesInput | Prisma.BikeModelScalarWhereWithAggregatesInput[];
    OR?: Prisma.BikeModelScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BikeModelScalarWhereWithAggregatesInput | Prisma.BikeModelScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BikeModel"> | string;
    brand?: Prisma.StringWithAggregatesFilter<"BikeModel"> | string;
    modelName?: Prisma.StringWithAggregatesFilter<"BikeModel"> | string;
    year?: Prisma.IntWithAggregatesFilter<"BikeModel"> | number;
    engineCapacity?: Prisma.StringNullableWithAggregatesFilter<"BikeModel"> | string | null;
    colors?: Prisma.StringNullableListFilter<"BikeModel">;
    description?: Prisma.StringNullableWithAggregatesFilter<"BikeModel"> | string | null;
    basePrice?: Prisma.DecimalWithAggregatesFilter<"BikeModel"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BikeModel"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BikeModel"> | Date | string;
};
export type BikeModelCreateInput = {
    id?: string;
    brand: string;
    modelName: string;
    year: number;
    engineCapacity?: string | null;
    colors?: Prisma.BikeModelCreatecolorsInput | string[];
    description?: string | null;
    basePrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitCreateNestedManyWithoutModelInput;
};
export type BikeModelUncheckedCreateInput = {
    id?: string;
    brand: string;
    modelName: string;
    year: number;
    engineCapacity?: string | null;
    colors?: Prisma.BikeModelCreatecolorsInput | string[];
    description?: string | null;
    basePrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bikes?: Prisma.BikeUnitUncheckedCreateNestedManyWithoutModelInput;
};
export type BikeModelUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    engineCapacity?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    colors?: Prisma.BikeModelUpdatecolorsInput | string[];
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    basePrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUpdateManyWithoutModelNestedInput;
};
export type BikeModelUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    engineCapacity?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    colors?: Prisma.BikeModelUpdatecolorsInput | string[];
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    basePrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bikes?: Prisma.BikeUnitUncheckedUpdateManyWithoutModelNestedInput;
};
export type BikeModelCreateManyInput = {
    id?: string;
    brand: string;
    modelName: string;
    year: number;
    engineCapacity?: string | null;
    colors?: Prisma.BikeModelCreatecolorsInput | string[];
    description?: string | null;
    basePrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BikeModelUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    engineCapacity?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    colors?: Prisma.BikeModelUpdatecolorsInput | string[];
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    basePrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BikeModelUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    engineCapacity?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    colors?: Prisma.BikeModelUpdatecolorsInput | string[];
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    basePrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BikeModelCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    engineCapacity?: Prisma.SortOrder;
    colors?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BikeModelAvgOrderByAggregateInput = {
    year?: Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
};
export type BikeModelMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    engineCapacity?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BikeModelMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    modelName?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    engineCapacity?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BikeModelSumOrderByAggregateInput = {
    year?: Prisma.SortOrder;
    basePrice?: Prisma.SortOrder;
};
export type BikeModelScalarRelationFilter = {
    is?: Prisma.BikeModelWhereInput;
    isNot?: Prisma.BikeModelWhereInput;
};
export type BikeModelCreatecolorsInput = {
    set: string[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BikeModelUpdatecolorsInput = {
    set?: string[];
    push?: string | string[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BikeModelCreateNestedOneWithoutBikesInput = {
    create?: Prisma.XOR<Prisma.BikeModelCreateWithoutBikesInput, Prisma.BikeModelUncheckedCreateWithoutBikesInput>;
    connectOrCreate?: Prisma.BikeModelCreateOrConnectWithoutBikesInput;
    connect?: Prisma.BikeModelWhereUniqueInput;
};
export type BikeModelUpdateOneRequiredWithoutBikesNestedInput = {
    create?: Prisma.XOR<Prisma.BikeModelCreateWithoutBikesInput, Prisma.BikeModelUncheckedCreateWithoutBikesInput>;
    connectOrCreate?: Prisma.BikeModelCreateOrConnectWithoutBikesInput;
    upsert?: Prisma.BikeModelUpsertWithoutBikesInput;
    connect?: Prisma.BikeModelWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BikeModelUpdateToOneWithWhereWithoutBikesInput, Prisma.BikeModelUpdateWithoutBikesInput>, Prisma.BikeModelUncheckedUpdateWithoutBikesInput>;
};
export type BikeModelCreateWithoutBikesInput = {
    id?: string;
    brand: string;
    modelName: string;
    year: number;
    engineCapacity?: string | null;
    colors?: Prisma.BikeModelCreatecolorsInput | string[];
    description?: string | null;
    basePrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BikeModelUncheckedCreateWithoutBikesInput = {
    id?: string;
    brand: string;
    modelName: string;
    year: number;
    engineCapacity?: string | null;
    colors?: Prisma.BikeModelCreatecolorsInput | string[];
    description?: string | null;
    basePrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BikeModelCreateOrConnectWithoutBikesInput = {
    where: Prisma.BikeModelWhereUniqueInput;
    create: Prisma.XOR<Prisma.BikeModelCreateWithoutBikesInput, Prisma.BikeModelUncheckedCreateWithoutBikesInput>;
};
export type BikeModelUpsertWithoutBikesInput = {
    update: Prisma.XOR<Prisma.BikeModelUpdateWithoutBikesInput, Prisma.BikeModelUncheckedUpdateWithoutBikesInput>;
    create: Prisma.XOR<Prisma.BikeModelCreateWithoutBikesInput, Prisma.BikeModelUncheckedCreateWithoutBikesInput>;
    where?: Prisma.BikeModelWhereInput;
};
export type BikeModelUpdateToOneWithWhereWithoutBikesInput = {
    where?: Prisma.BikeModelWhereInput;
    data: Prisma.XOR<Prisma.BikeModelUpdateWithoutBikesInput, Prisma.BikeModelUncheckedUpdateWithoutBikesInput>;
};
export type BikeModelUpdateWithoutBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    engineCapacity?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    colors?: Prisma.BikeModelUpdatecolorsInput | string[];
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    basePrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BikeModelUncheckedUpdateWithoutBikesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.StringFieldUpdateOperationsInput | string;
    modelName?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    engineCapacity?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    colors?: Prisma.BikeModelUpdatecolorsInput | string[];
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    basePrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BikeModelCountOutputType = {
    bikes: number;
};
export type BikeModelCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bikes?: boolean | BikeModelCountOutputTypeCountBikesArgs;
};
export type BikeModelCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelCountOutputTypeSelect<ExtArgs> | null;
};
export type BikeModelCountOutputTypeCountBikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeUnitWhereInput;
};
export type BikeModelSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    brand?: boolean;
    modelName?: boolean;
    year?: boolean;
    engineCapacity?: boolean;
    colors?: boolean;
    description?: boolean;
    basePrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    bikes?: boolean | Prisma.BikeModel$bikesArgs<ExtArgs>;
    _count?: boolean | Prisma.BikeModelCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["bikeModel"]>;
export type BikeModelSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    brand?: boolean;
    modelName?: boolean;
    year?: boolean;
    engineCapacity?: boolean;
    colors?: boolean;
    description?: boolean;
    basePrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["bikeModel"]>;
export type BikeModelSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    brand?: boolean;
    modelName?: boolean;
    year?: boolean;
    engineCapacity?: boolean;
    colors?: boolean;
    description?: boolean;
    basePrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["bikeModel"]>;
export type BikeModelSelectScalar = {
    id?: boolean;
    brand?: boolean;
    modelName?: boolean;
    year?: boolean;
    engineCapacity?: boolean;
    colors?: boolean;
    description?: boolean;
    basePrice?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BikeModelOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "brand" | "modelName" | "year" | "engineCapacity" | "colors" | "description" | "basePrice" | "createdAt" | "updatedAt", ExtArgs["result"]["bikeModel"]>;
export type BikeModelInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bikes?: boolean | Prisma.BikeModel$bikesArgs<ExtArgs>;
    _count?: boolean | Prisma.BikeModelCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BikeModelIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type BikeModelIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $BikeModelPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BikeModel";
    objects: {
        bikes: Prisma.$BikeUnitPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        brand: string;
        modelName: string;
        year: number;
        engineCapacity: string | null;
        colors: string[];
        description: string | null;
        basePrice: runtime.Decimal;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["bikeModel"]>;
    composites: {};
};
export type BikeModelGetPayload<S extends boolean | null | undefined | BikeModelDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BikeModelPayload, S>;
export type BikeModelCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BikeModelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BikeModelCountAggregateInputType | true;
};
export interface BikeModelDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BikeModel'];
        meta: {
            name: 'BikeModel';
        };
    };
    findUnique<T extends BikeModelFindUniqueArgs>(args: Prisma.SelectSubset<T, BikeModelFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BikeModelFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BikeModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BikeModelFindFirstArgs>(args?: Prisma.SelectSubset<T, BikeModelFindFirstArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BikeModelFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BikeModelFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BikeModelFindManyArgs>(args?: Prisma.SelectSubset<T, BikeModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BikeModelCreateArgs>(args: Prisma.SelectSubset<T, BikeModelCreateArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BikeModelCreateManyArgs>(args?: Prisma.SelectSubset<T, BikeModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BikeModelCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BikeModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BikeModelDeleteArgs>(args: Prisma.SelectSubset<T, BikeModelDeleteArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BikeModelUpdateArgs>(args: Prisma.SelectSubset<T, BikeModelUpdateArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BikeModelDeleteManyArgs>(args?: Prisma.SelectSubset<T, BikeModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BikeModelUpdateManyArgs>(args: Prisma.SelectSubset<T, BikeModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BikeModelUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BikeModelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BikeModelUpsertArgs>(args: Prisma.SelectSubset<T, BikeModelUpsertArgs<ExtArgs>>): Prisma.Prisma__BikeModelClient<runtime.Types.Result.GetResult<Prisma.$BikeModelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BikeModelCountArgs>(args?: Prisma.Subset<T, BikeModelCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BikeModelCountAggregateOutputType> : number>;
    aggregate<T extends BikeModelAggregateArgs>(args: Prisma.Subset<T, BikeModelAggregateArgs>): Prisma.PrismaPromise<GetBikeModelAggregateType<T>>;
    groupBy<T extends BikeModelGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BikeModelGroupByArgs['orderBy'];
    } : {
        orderBy?: BikeModelGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BikeModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBikeModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BikeModelFieldRefs;
}
export interface Prisma__BikeModelClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    bikes<T extends Prisma.BikeModel$bikesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BikeModel$bikesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BikeUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BikeModelFieldRefs {
    readonly id: Prisma.FieldRef<"BikeModel", 'String'>;
    readonly brand: Prisma.FieldRef<"BikeModel", 'String'>;
    readonly modelName: Prisma.FieldRef<"BikeModel", 'String'>;
    readonly year: Prisma.FieldRef<"BikeModel", 'Int'>;
    readonly engineCapacity: Prisma.FieldRef<"BikeModel", 'String'>;
    readonly colors: Prisma.FieldRef<"BikeModel", 'String[]'>;
    readonly description: Prisma.FieldRef<"BikeModel", 'String'>;
    readonly basePrice: Prisma.FieldRef<"BikeModel", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"BikeModel", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BikeModel", 'DateTime'>;
}
export type BikeModelFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where: Prisma.BikeModelWhereUniqueInput;
};
export type BikeModelFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where: Prisma.BikeModelWhereUniqueInput;
};
export type BikeModelFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where?: Prisma.BikeModelWhereInput;
    orderBy?: Prisma.BikeModelOrderByWithRelationInput | Prisma.BikeModelOrderByWithRelationInput[];
    cursor?: Prisma.BikeModelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BikeModelScalarFieldEnum | Prisma.BikeModelScalarFieldEnum[];
};
export type BikeModelFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where?: Prisma.BikeModelWhereInput;
    orderBy?: Prisma.BikeModelOrderByWithRelationInput | Prisma.BikeModelOrderByWithRelationInput[];
    cursor?: Prisma.BikeModelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BikeModelScalarFieldEnum | Prisma.BikeModelScalarFieldEnum[];
};
export type BikeModelFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where?: Prisma.BikeModelWhereInput;
    orderBy?: Prisma.BikeModelOrderByWithRelationInput | Prisma.BikeModelOrderByWithRelationInput[];
    cursor?: Prisma.BikeModelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BikeModelScalarFieldEnum | Prisma.BikeModelScalarFieldEnum[];
};
export type BikeModelCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BikeModelCreateInput, Prisma.BikeModelUncheckedCreateInput>;
};
export type BikeModelCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BikeModelCreateManyInput | Prisma.BikeModelCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BikeModelCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    data: Prisma.BikeModelCreateManyInput | Prisma.BikeModelCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BikeModelUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BikeModelUpdateInput, Prisma.BikeModelUncheckedUpdateInput>;
    where: Prisma.BikeModelWhereUniqueInput;
};
export type BikeModelUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BikeModelUpdateManyMutationInput, Prisma.BikeModelUncheckedUpdateManyInput>;
    where?: Prisma.BikeModelWhereInput;
    limit?: number;
};
export type BikeModelUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BikeModelUpdateManyMutationInput, Prisma.BikeModelUncheckedUpdateManyInput>;
    where?: Prisma.BikeModelWhereInput;
    limit?: number;
};
export type BikeModelUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where: Prisma.BikeModelWhereUniqueInput;
    create: Prisma.XOR<Prisma.BikeModelCreateInput, Prisma.BikeModelUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BikeModelUpdateInput, Prisma.BikeModelUncheckedUpdateInput>;
};
export type BikeModelDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
    where: Prisma.BikeModelWhereUniqueInput;
};
export type BikeModelDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BikeModelWhereInput;
    limit?: number;
};
export type BikeModel$bikesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BikeModelDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BikeModelSelect<ExtArgs> | null;
    omit?: Prisma.BikeModelOmit<ExtArgs> | null;
    include?: Prisma.BikeModelInclude<ExtArgs> | null;
};
