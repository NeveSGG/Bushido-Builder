import { z } from "zod";

const attributeSchema = z.object({
    name: z.string(),
    value: z.any()
})

const baseTreeElementSchema = z.object({
    id: z.number(),
    name: z.string(),
    attributes: z.array(attributeSchema),
    props: z.array(z.any())
})

type TreeElement = z.infer<typeof baseTreeElementSchema> & {
    children: TreeElement[];
}

const treeElementSchema: z.ZodType<TreeElement> = baseTreeElementSchema.extend({
    children: z.lazy(() => treeElementSchema.array()),
})

export const treeSchema = z.array(treeElementSchema);