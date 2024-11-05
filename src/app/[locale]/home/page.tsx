import { Metadata } from 'next'
import Head from 'next/head'
import { ReactNode } from 'react'
import AuthLayoutWrapper from 'src/hoc/AuthLayoutWrapper'
import { getAllProductsPublic } from 'src/services/product'
import { getAllProductTypes } from 'src/services/product-type'

// layouts
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'

// ** Pages
import HomePage from 'src/views/pages/home'

interface TOptions {
  label: string
  value: string
}

const getProductData = async () => {
  const limit = 10
  const page = 1
  const order = 'createdAt desc'
  try {
    const productTypes: TOptions[] = []
    await getAllProductTypes({ params: { limit: -1, page: -1 } }).then(res => {
      const data = res?.data.productTypes
      if (data) {
        data?.map((item: { name: string; _id: string }) => {
          productTypes.push({ label: item.name, value: item._id })
        })
      }
    })
    const res = await getAllProductsPublic({
      params: { limit: limit, page: page, order, productType: productTypes?.[0]?.value }
    })

    const data = res.data

    return {
      products: data?.products,
      totalCount: data?.totalCount,
      productTypes: productTypes || [],
      params: {
        limit,
        page,
        order,
        productType: productTypes?.[0]?.value || ''
      }
    }
  } catch (error) {
    return {
      products: [],
      totalCount: 0,
      productTypes: [],
      params: {
        limit,
        page,
        order,
        productType: ''
      }
    }
  }
}

export const metadata: Metadata = {
  title: 'The Wander Shop - Danh sách sản phẩm',
  description: 'Work wear by The Wander Shop - Timeless Lifestyle In A Modern World',
  keywords: `The Wander Shop - Timeless Lifestyle In A Modern World, The Wander Shop`,
  openGraph: {
    title: 'The Wander Shop - Danh sách sản phẩm',
    description: 'Work wear by The Wander Shop - Timeless Lifestyle In A Modern World',
    type: 'website',
    url: `https://e-commerce-2024-fe.vercel.app/home`
  },
  twitter: {
    title: 'The Wander Shop - Danh sách sản phẩm',
    description: 'Work wear by The Wander Shop - Timeless Lifestyle In A Modern World'
  }
}

export default async function Home() {
  const { products, totalCount, params, productTypes } = await getProductData()

  return (
    <AuthLayoutWrapper
      guestGuard={false}
      authGuard={false}
      getLayout={(page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>}
    >
      <HomePage products={products} totalCount={totalCount} paramsServer={params} productTypesServer={productTypes} />
    </AuthLayoutWrapper>
  )
}

// Home.title = "Danh sách sản phẩm của cửa hàng The Wander Shop"
export const dynamic = 'force-static'
export const revalidate = 10
export const maxDuration = 60
