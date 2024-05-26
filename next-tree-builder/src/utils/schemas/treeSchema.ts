import { z } from "zod";

const attributeSchema = z.object({
  name: z.string(),
  value: z.any(),
});

export const propSchema = z.object({
  name: z.string(),
  type: z.enum(["React", "string", "image", "checkbox", "code", "enum"]),
  description: z.string().optional(),
  value: z.any(),
});

const baseTreeElementSchema = z.object({
  id: z.number(),
  name: z.string(),
  attributes: z.array(attributeSchema),
  props: z.array(propSchema),
});

type TreeElement = z.infer<typeof baseTreeElementSchema> & {
  children: Array<TreeElement>;
};

const treeElementSchema: z.ZodType<TreeElement> = baseTreeElementSchema.extend({
  children: z.lazy(() => treeElementSchema.array()),
});

export const treeSchema = z.array(treeElementSchema);
