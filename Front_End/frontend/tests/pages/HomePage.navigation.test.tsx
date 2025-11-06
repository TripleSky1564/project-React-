import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from '../../src/pages/Home/HomePage'
import { ServiceDetailPage } from '../../src/pages/ServiceDetail/ServiceDetailPage'

describe('HomePage category navigation', () => {
  test('opens service detail guidance from life-event category', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const user = userEvent.setup()
    const detailLink = await screen.findByRole('link', {
      name: '기초연금 신청 상세 안내 보기',
    })

    await user.click(detailLink)

    expect(await screen.findByRole('heading', { name: '기초연금 신청' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '지원 대상 주요 요건' })).toBeInTheDocument()
  })
})
