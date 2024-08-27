import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { Window } from './components/Window'
import itemsJson from './components/Inventory/items.json'
import { onGameEvent, sendGameCommand } from './lib/electron'

const items = new Map<string, JsonItem>()
itemsJson.forEach((item) => {
  if (item.objectName) {
    items.set(item.objectName, item)
  }
})

type JsonItem = {
  fileName: string
  objectName: string
  price: number
  name: string
  totalDamage: number
  requiredAttribute: number
  requiredAttributeValue: number
  description1: string
  value1: number
  description2: string
  value2: number
  description3: string
  value3: number
  description4: string
  value4: number
  description5: string
  value5: number
}

export type Item = {
  objectName: string
  category?: string
  amount: number
  isNative: boolean
  isEquipped: boolean
}

const itemCategorySortPriority: { [key: string]: number } = {
  ITMW: 1,
  ITRW: 2,
  ITPO: 3,
  ITFO: 4,
  ITAT: 5,
  ITPL: 6,
  ITAR: 7,
  ITAL: 8,
  ITRI: 9,
  ITBE: 10,
  ITRU: 11,
  ITSC: 12,
}

const ItemDetails = ({ text, value }: { text: string; value: number }) => {
  if (!text || value == 0) {
    return null
  }

  return (
    <ItemDetail>
      <ItemDetailText>{text}</ItemDetailText>
      <ItemDetailValue>{value > 0 && value}</ItemDetailValue>
    </ItemDetail>
  )
}

function Equipment() {
  const [inventory, setInventory] = useState<Item[]>([])

  useEffect(() => {
    onGameEvent('EqUpdate', (updatedInventoryArray: Item[]) => {
      updatedInventoryArray.sort((a, b) => {
        const categoryA = a.category || 'null'
        const categoryB = b.category || 'null'
        const priorityA = itemCategorySortPriority[categoryA] || 100
        const priorityB = itemCategorySortPriority[categoryB] || 100

        return priorityA - priorityB
      })
      setInventory(updatedInventoryArray)
    })
  }, [])

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={100}>
      <PageWrapper>
        <Window
          title="Ekwipunek"
          width={473}
          leftContent={
            <GoldBar>
              <GoldImage src={require('./gold.png')} alt="" />
              {inventory.find((item) => item.objectName === 'ITMI_GOLD')?.amount ?? 1000}
            </GoldBar>
          }
        >
          <Items>
            {inventory.map((invItem) => {
              const item = items.get(invItem.objectName)
              const amount = invItem.amount || 1

              if (!item) {
                return null
              }

              return (
                <Tooltip key={item.objectName}>
                  <ItemSlot
                    onClick={() => {
                      sendGameCommand('UseItem', item.objectName)
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      sendGameCommand('DropItem', item.objectName)
                    }}
                    isEquipped={invItem.isEquipped}
                  >
                    <TooltipTrigger>
                      <ItemImage src={`/inventory/${item.fileName}.png`} alt="" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <TooltipContainer>
                        <InventoryTooltip>
                          <InventoryTooltipTitle>{item.name}</InventoryTooltipTitle>
                          <ItemDetailsWrapper>
                            <ItemDetails text={item.description1} value={item.value1} />
                            <ItemDetails text={item.description2} value={item.value2} />
                            <ItemDetails text={item.description3} value={item.value3} />
                            <ItemDetails text={item.description4} value={item.value4} />
                            <ItemDetails text={item.description5} value={item.value5} />
                          </ItemDetailsWrapper>
                          <InventoryTooltipFooter>
                            <InventoryTooltipAmount>x {amount}</InventoryTooltipAmount>
                            <InventoryTooltipCost>
                              {item.price}
                              <GoldImage src={require('./gold.png')} alt="" />
                            </InventoryTooltipCost>
                          </InventoryTooltipFooter>
                        </InventoryTooltip>
                      </TooltipContainer>
                    </TooltipContent>
                  </ItemSlot>
                </Tooltip>
              )
            })}
          </Items>
        </Window>
      </PageWrapper>
    </TooltipProvider>
  )
}

export default Equipment

const PageWrapper = styled.div`
  margin-top: 200px;
  margin-left: 200px;
`

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  overflow: hidden;
  align-content: start;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const ItemSlot = styled.div<{ isEquipped: boolean }>`
  width: 64px;
  height: 64px;
  margin: 3px;
  padding: 5px;
  &:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
  ${(props) =>
    props.isEquipped &&
    `
    background: linear-gradient(0deg, rgb(83 3 3 / 30%), rgba(83, 3, 3, 0.3)), url(/item-slot.png);
`}
  ${(props) =>
    !props.isEquipped &&
    `
  background-image: url('/item-slot.png');
`}
  background-size: cover;
`

const ItemImage = styled.img``

const GoldBar = styled.div`
  display: flex;
  align-items: center;
  color: #b28f3b;
  height: 100%;
  margin-left: 20px;
`

const GoldImage = styled.img``

const ItemDetail = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
`

const ItemDetailText = styled.div``
const ItemDetailValue = styled.div``

const ItemDetailsWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
`

const TooltipContainer = styled.div`
  width: 300px;
  height: auto;
`

const InventoryTooltip = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  max-height: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: -4px 25px 20px -8px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`

const InventoryTooltipTitle = styled.div`
  background-color: #dc8c2468;
  text-align: center;
  width: 99%;
  margin: 0;
  padding: 5px 0;
`

const InventoryTooltipFooter = styled.div`
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 10px;
`

const InventoryTooltipAmount = styled.div``
const InventoryTooltipCost = styled.div`
  display: flex;
`
