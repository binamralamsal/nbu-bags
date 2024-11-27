import { eq, sql } from "drizzle-orm";

import { db } from "@/libs/drizzle";
import {
  categoriesTable,
  productFilesTable,
  productsTable,
  uploadedFilesTable,
} from "@/libs/drizzle/schema";

// const allProducts = await db
//   .select({
//     name: productsTable.id,
//     slug: productsTable.slug,
//     description: productsTable.description,
//     status: productsTable.status,
//     createdAt: productsTable.createdAt,
//     updatedAt: productsTable.updatedAt,
//     images: sql<
//       {
//         id: number;
//         name: string;
//         url: string;
//         fileType: string;
//         uploadedAt: string;
//       }[]
//     >`JSON_AGG(
//           JSON_BUILD_OBJECT(
//             'id', ${uploadedFilesTable.id},
//             'name', ${uploadedFilesTable.name},
//             'url', ${uploadedFilesTable.url},
//             'fileType', ${uploadedFilesTable.fileType},
//             'uploadedAt', ${uploadedFilesTable.uploadedAt}
//           )
//         )`,
//   })
//   .from(productsTable)
//   .leftJoin(
//     productFilesTable,
//     eq(productsTable.id, productFilesTable.productId),
//   )
//   .innerJoin(
//     uploadedFilesTable,
//     eq(productFilesTable.fileId, uploadedFilesTable.id),
//   )
//   .groupBy(productsTable.id);
// console.log(allProducts[0].images);

const id = 14;

type Image = {
  id: number;
  name: string;
  url: string;
  fileType: string;
  uploadedAt: string;
};

const [product] = await db
  .select({
    id: productsTable.id,
    name: productsTable.name,
    slug: productsTable.slug,
    status: productsTable.status,
    description: productsTable.description,
    category: {
      name: categoriesTable.name,
      id: categoriesTable.id,
    },
    createdAt: productsTable.createdAt,
    updatedAt: productsTable.updatedAt,
    images: sql<Image[]>`COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ${uploadedFilesTable.id},
          'name', ${uploadedFilesTable.name},
          'url', ${uploadedFilesTable.url},
          'fileType', ${uploadedFilesTable.fileType},
          'uploadedAt', ${uploadedFilesTable.uploadedAt}
        )
      ) FILTER (WHERE ${uploadedFilesTable.id} IS NOT NULL), '[]'
    )`,
  })
  .from(productsTable)
  .where(eq(productsTable.id, id))
  .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
  .leftJoin(
    productFilesTable,
    eq(productsTable.id, productFilesTable.productId),
  )
  .leftJoin(
    uploadedFilesTable,
    eq(uploadedFilesTable.id, productFilesTable.fileId),
  )
  .groupBy(productsTable.id, categoriesTable.id);
console.log(product);
