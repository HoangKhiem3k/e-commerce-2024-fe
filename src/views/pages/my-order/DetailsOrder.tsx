// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'
// ** React
import { useEffect, useMemo, useState } from 'react'
// ** Mui
import { Avatar, Box, Button, Divider, Typography, useTheme } from '@mui/material'
// ** Components
import Spinner from 'src/components/spinner'
// ** Translate
import { useTranslation } from 'react-i18next'
// ** Redux
import { cancelOrderProductOfMeAsync } from 'src/stores/order-product/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'
// ** Other
import toast from 'react-hot-toast'
// ** Types
import { TItemOrderProduct, TItemOrderProductMe, TItemProductMe } from 'src/types/order-product'
import { STATUS_ORDER_PRODUCT } from 'src/configs/orderProduct'
import { convertUpdateMultipleProductsCart, formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { getDetailsOrderProductByMe } from 'src/services/order-product'
import Icon from 'src/components/Icon'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { ROUTE_CONFIG } from 'src/configs/route'

type TProps = {}
const MyOrderPage: NextPage<TProps> = () => {
  // State
  const [isLoading, setIsLoading] = useState(false)
  const [dataOrder, setDataOrder] = useState<TItemOrderProductMe>({} as any)
  const [openCancel, setOpenCancel] = useState(false)
  // ** Hooks
  const { t } = useTranslation()
  const router = useRouter()
  const orderId = router.query.orderId as string
  const { user } = useAuth()
  // ** theme
  const theme = useTheme()
  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isSuccessCancelMe, orderItems, isErrorCancelMe, messageErrorCancelMe } = useSelector(
    (state: RootState) => state.orderProduct
  )
  // ** fetch API
  const handleConfirmCancel = () => {
    dispatch(cancelOrderProductOfMeAsync(dataOrder._id))
  }
  // ** handle
  const handleCloseDialog = () => {
    setOpenCancel(false)
  }
  const handleGetDetailsOrdersOfMe = async () => {
    setIsLoading(true)
    await getDetailsOrderProductByMe(orderId).then(res => {
      setDataOrder(res?.data)
      setIsLoading(false)
    })
  }
  useEffect(() => {
    if (isSuccessCancelMe) {
      handleCloseDialog()
    }
  }, [isSuccessCancelMe])
  const handleUpdateProductToCart = (items: TItemOrderProduct[]) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateMultipleProductsCart(orderItems, items)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    }
  }
  const handleBuyAgain = () => {
    handleUpdateProductToCart(
      dataOrder.orderItems.map(item => ({
        name: item.name,
        amount: item.amount,
        image: item.image,
        price: item.price,
        discount: item.discount,
        product: item?.product?._id,
        slug: item?.product?.slug
      }))
    )
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,
        query: {
          selected: dataOrder?.orderItems?.map((item: TItemProductMe) => item?.product?._id)
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }
  const memeDisabledBuyAgain = useMemo(() => {
    return dataOrder?.orderItems?.some(item => !item.product.countInStock)
  }, [dataOrder?.orderItems])
  useEffect(() => {
    if (orderId) {
      handleGetDetailsOrdersOfMe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])
  useEffect(() => {
    if (isSuccessCancelMe) {
      handleGetDetailsOrdersOfMe()
      dispatch(resetInitialState())
    } else if (isErrorCancelMe && messageErrorCancelMe) {
      toast.error(t('Cancel_order_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessCancelMe, isErrorCancelMe, messageErrorCancelMe])

  return (
    <>
      {isLoading && <Spinner />}
      <ConfirmationDialog
        open={openCancel}
        handleClose={handleCloseDialog}
        handleCancel={handleCloseDialog}
        handleConfirm={handleConfirmCancel}
        title={t('Title_cancel_order')}
        description={t('Confirm_cancel_order')}
      />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, alignItems: 'center' }}>
          <Button startIcon={<Icon icon='fluent-mdl2:chrome-back'></Icon>} onClick={() => router.back()}>
            {t('Back')}
          </Button>
          {dataOrder?.status === 2 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon='carbon:delivery'></Icon>
              <Typography>
                <span style={{ color: theme.palette.success.main }}>{t('Order_has_been_delivery')}</span>
                <span>{' | '}</span>
              </Typography>
            </Box>
          )}
          <Typography sx={{ textTransform: 'uppercase', color: theme.palette.primary.main, fontWeight: 600 }}>
            {t(`${(STATUS_ORDER_PRODUCT as any)[dataOrder?.status]?.label}`)}
          </Typography>
        </Box>
        <Divider />
        <Box mt={2} mb={2} sx={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}>
          {dataOrder?.orderItems?.map((item: TItemProductMe) => {
            return (
              <Box key={item?.product?._id} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Box
                  sx={{
                    border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
                  }}
                >
                  <Avatar
                    sx={{
                      width: '80px',
                      height: '80px'
                    }}
                    src={item.image}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      display: 'block'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        color: item.discount > 0 ? theme.palette.error.main : theme.palette.primary.main,
                        textDecoration: item.discount > 0 ? 'line-through' : 'normal',
                        fontSize: '14px'
                      }}
                    >
                      {formatNumberToLocal(item.price)} VND
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.discount > 0 && (
                        <Typography
                          variant='h4'
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: '14px'
                          }}
                        >
                          {formatNumberToLocal((item.price * (100 - item.discount)) / 100)}
                        </Typography>
                      )}
                      {item.discount > 0 && (
                        <Box
                          sx={{
                            backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                            width: '36px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '2px'
                          }}
                        >
                          <Typography
                            variant='h6'
                            sx={{
                              color: theme.palette.error.main,
                              fontSize: '10px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            - {item.discount} %
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px'
                    }}
                  >
                    x {item.amount}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Address_shipping')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.address} {dataOrder?.shippingAddress?.city?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Phone_number')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Order_name_user')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.fullName}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Item_price')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {formatNumberToLocal(dataOrder?.itemsPrice)} VND
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Shipping_price')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {formatNumberToLocal(dataOrder?.shippingPrice)} VND
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '2px', mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Sum_money')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {formatNumberToLocal(dataOrder?.totalPrice)} VND
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 6, justifyContent: 'flex-end' }}>
          {[0, 1].includes(dataOrder?.status) && (
            <Button
              variant='outlined'
              onClick={() => setOpenCancel(true)}
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                color: '#da251d !important',
                backgroundColor: 'transparent !important',
                border: '1px solid #da251d !important'
              }}
            >
              {t('Cancel_order')}
            </Button>
          )}
          <Button
            variant='contained'
            onClick={handleBuyAgain}
            sx={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 'bold'
            }}
            disabled={memeDisabledBuyAgain}
          >
            {t('Buy_again')}
          </Button>
        </Box>
      </Box>
    </>
  )
}
export default MyOrderPage
