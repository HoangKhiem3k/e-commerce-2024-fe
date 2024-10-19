import { Box, useTheme } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { OBJECT_TYPE_USER } from 'src/configs/user'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

interface TProps {
  data: Record<number, number>
}
const CardCountUserType = (props: TProps) => {
  const { data } = props
  const mapObject = OBJECT_TYPE_USER()
  const { t } = useTranslation()
  const theme = useTheme()
  const labelMemo = useMemo(() => {
    if (data) {
      return Object?.keys(data)?.map(key => {
        return (mapObject as any)?.[key]?.label
      })
    }

    return []
  }, [data])

  const valueMemo = useMemo(() => {
    if (data) {
      return Object?.keys(data)?.map(key => {
        return (data as any)?.[key]
      })
    }

    return []
  }, [data])

  const dataChart = {
    labels: labelMemo,
    datasets: [
      {
        label: `${t('# of Users')}`,
        data: valueMemo,
        backgroundColor: [
          hexToRGBA(theme.palette.success.main, 0.4),
          hexToRGBA(theme.palette.warning.main, 0.4),
          hexToRGBA(theme.palette.error.main, 0.4),
          hexToRGBA(theme.palette.primary.main, 0.4),
          hexToRGBA(theme.palette.secondary.main, 0.4),
          hexToRGBA(theme.palette.info.main, 0.4)
        ],
        borderColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px',
        height: '400px',
        width: '100%',
        borderRadius: '15px',
        canvas: {
          width: '100% !important'
        }
      }}
    >
      <Pie
        data={dataChart}
        options={{
          plugins: {
            title: { display: true, text: `${t('Count_user_by_status')}` }
          }
        }}
      />
    </Box>
  )
}
export default CardCountUserType
