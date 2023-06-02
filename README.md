# E-commerce_APIs
This repository contains APIs for product and category where you can create, update, list, delete products and categories.



Welcome:

       localhost:3030/api


### Category APIs:

1. Create Category:
    
       localhost:3030/api/category/create
       
2. List all Category:

       localhost:3030/api/category/list

       localhost:3030/api/category/list?page=1
       
       localhost:3030/api/category/list?page=1&limit=5
       
       localhost:3030/api/category/list?categoryName=<name>
       
3. View Category by Id:
     
       localhost:3030/api/category/:id/view
       
4. Update Category:

       localhost:3030/api/category/:id/update
       
5. Delete Category: (Soft Delete)

       localhost:3030/api/category/:id/delete


### Product APIs:

1. Create Product:

       localhost:3030/api/create
       
2. View product by Id:

       localhost:3030/api/:id/view
       
3. List all product:

       localhost:3030/api/list
       
       localhost:3030/api/list?page=1
       
       localhost:3030/api/list?page=1&limit=5
       
       localhost:3030/api/list?productSku=<sku>
       
       localhost:3030/api/list?productName=<productName>
       
       localhost:3030/api/list?categoryName=<categoryName>
       
       localhost:3030/api/list?categoryId=<categoryid>
       
4. Update Product:

       localhost:3030/api/:id/update
       
5. Delete Product: (Soft Delete)
 
       localhost:3030/api/:id/delete
