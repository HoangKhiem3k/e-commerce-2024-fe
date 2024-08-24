// ** Redux
import { createSlice } from '@reduxjs/toolkit'
// ** Actions
import { serviceName, createOrderProductAsync, getAllOrderProductsByMeAsync } from 'src/stores/order-product/actions'

const initialState = {
  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  isLoading: false,
  typeError: '',
  orderItems: [],
  ordersOfMe: {
    data: [],
    total: 0
  }
}

export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCart: (state, action) => {
      state.orderItems = action.payload.orderItems
    },
    resetInitialState: state => {
      state.isSuccessCreate = false
      state.isErrorCreate = true
      state.messageErrorCreate = ''
      state.typeError = ''
      state.isLoading = false
    }
  },
  extraReducers: builder => {
    // ** create order product
    builder.addCase(createOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action.payload?.data?._id
      state.isErrorCreate = !action.payload?.data?._id
      state.messageErrorCreate = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // ** get all order products by me
    builder.addCase(getAllOrderProductsByMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderProductsByMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = action.payload?.data?.orders || []
      state.ordersOfMe.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsByMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = []
      state.ordersOfMe.total = 0
    })
  }
})

export const { updateProductToCart, resetInitialState } = orderProductSlice.actions
export default orderProductSlice.reducer
