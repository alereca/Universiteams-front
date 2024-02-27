import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { ReadonlyURLSearchParams } from 'next/navigation'

const setUrlParam = (
  router: AppRouterInstance,
  pathname: string,
  searchQuery: ReadonlyURLSearchParams,
  paramName: string,
  value: string | null
): ReadonlyURLSearchParams => {
  const currentUrlParams = new URLSearchParams(searchQuery.toString())

  if (value === null || value === undefined || value === '') {
    currentUrlParams.delete(paramName)
  } else {
    currentUrlParams.set(paramName, value)
  }

  router.push(`${pathname}?${currentUrlParams.toString()}`)

  return currentUrlParams as ReadonlyURLSearchParams
}

const appendToUrl = (
  router: AppRouterInstance,
  pathname: string,
  searchQuery: ReadonlyURLSearchParams,
  paramName: string,
  values: string[]
) => {
  const currentUrlParams = new URLSearchParams(searchQuery.toString())

  values.forEach((value) => {
    if (currentUrlParams.getAll(paramName).find((v) => v === value) === undefined) {
      currentUrlParams.append(paramName, value)
    }
  })

  router.push(`${pathname}?${currentUrlParams.toString()}`)
}

const replaceArrayInUrl = (
  router: AppRouterInstance,
  pathname: string,
  searchQuery: ReadonlyURLSearchParams,
  paramName: string,
  values: string[]
) => {
  const currentUrlParams = new URLSearchParams(searchQuery.toString())

  currentUrlParams.delete(paramName)
  values.forEach((value) => {
    if (currentUrlParams.getAll(paramName).find((v) => v === value) === undefined) {
      currentUrlParams.append(paramName, value)
    }
  })

  router.push(`${pathname}?${currentUrlParams.toString()}`)
}

export const Url = { setUrlParam, appendToUrl, replaceArrayInUrl }
