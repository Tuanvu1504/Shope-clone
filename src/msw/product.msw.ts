import { rest } from 'msw'
import config from 'src/contance/config'

const productsRes = {
  message: 'Lấy các sản phẩm thành công',
  data: {
    products: [
      {
        _id: '60afb2c76ef5b902180aacba',
        images: [
          'https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg',
          'https://api-ecom.duthanhduoc.com/images/6c4f6bde-6242-40fd-be52-d06033636e04.jpg',
          'https://api-ecom.duthanhduoc.com/images/1385ed69-6843-4edb-a1fb-e5fc795a99e5.jpg',
          'https://api-ecom.duthanhduoc.com/images/7f4f7a5b-b003-462a-a6b9-c0e69175def3.jpg',
          'https://api-ecom.duthanhduoc.com/images/1c323bdd-c0ef-4538-b09d-34c1a4478baa.jpg',
          'https://api-ecom.duthanhduoc.com/images/5054f46f-d317-40f6-a804-6b22dc92e946.jpg',
          'https://api-ecom.duthanhduoc.com/images/eed30991-df2d-41b5-afb2-697a06ba3299.jpg',
          'https://api-ecom.duthanhduoc.com/images/2922fee1-448c-4302-bcc2-804e0fe44f84.jpg',
          'https://api-ecom.duthanhduoc.com/images/84f7bf91-685c-4be9-bd8c-1f0a4e2e21c3.jpg'
        ],
        price: 3190000,
        rating: 4.6,
        price_before_discount: 3990000,
        quantity: 138,
        sold: 1200,
        view: 54938,
        name: 'Điện Thoại Vsmart Active 3 6GB/64GB - Hàng Chính Hãng',
        category: {
          _id: '60afafe76ef5b902180aacb5',
          name: 'Điện thoại',
          __v: 0
        },
        image:
          'https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg',
        createdAt: '2021-05-27T14:55:03.113Z',
        updatedAt: '2023-07-22T06:52:33.281Z'
      }
    ],
    pagination: {
      page: 1,
      limit: 1,
      page_size: 45
    }
  }
}

const productsRequest = rest.get(`${config.baseURL}products`, (_, res, ctx) => {
  return res(ctx.status(200), ctx.json(productsRes))
})

const productRequests = [productsRequest]
export default productRequests
