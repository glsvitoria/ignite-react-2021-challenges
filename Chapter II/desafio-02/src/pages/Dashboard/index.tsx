import { useState, useEffect } from 'react'

import { Header } from '../../components/Header'
import api from '../../services/api'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'
import { Food } from '../../components/Food'

export interface FoodItem {
	id: number
	name: string
	description: string
	price: string
	available: boolean
	image: string
}

export function Dashboard() {
	const [foods, setFoods] = useState<FoodItem[]>([])
	const [editingFood, setEditingFood] = useState<any>({})
	const [modalOpen, setModalOpen] = useState(false)
	const [editModalOpen, setEditModalOpen] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			const response = await api.get('/foods')
			setFoods(response.data)
		}

		fetchData().catch(console.error)
	}, [])

	async function handleAddFood( food : FoodItem) {
		try {
			const response = await api.post('/foods', {
				...food,
				available: true,
			})

			setFoods([...foods, response.data])
		} catch (err) {
			console.log(err)
		}
	}

	async function handleUpdateFood(food: FoodItem) {
      if(editingFood == null) return

		try {
			const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
				...editingFood,
				...food,
			})

			const foodsUpdated = foods.map((f) =>
				f.id !== foodUpdated.data.id ? f : foodUpdated.data
			)

			setFoods(foodsUpdated)
		} catch (err) {
			console.log(err)
		}
	}

	async function handleDeleteFood(id: number) {
		await api.delete(`/foods/${id}`)

		const foodsFiltered = foods.filter((food) => food.id !== id)

		setFoods(foodsFiltered)
	}

	function toggleModal() {
		setModalOpen(!modalOpen)
	}

	function toggleEditModal() {
		setEditModalOpen(!editModalOpen)
	}

	function handleEditFood(food: FoodItem) {
		setEditingFood(food)
		setEditModalOpen(true)
	}

	return (
		<>
			<Header openModal={toggleModal} />
			<ModalAddFood
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				handleAddFood={handleAddFood}
			/>
			<ModalEditFood
				isOpen={editModalOpen}
				setIsOpen={toggleEditModal}
				editingFood={editingFood}
				handleUpdateFood={handleUpdateFood}
			/>

			<FoodsContainer data-testid="foods-list">
				{foods &&
					foods.map((food) => (
						<Food
							key={food.id}
							food={food}
							handleDelete={handleDeleteFood}
							handleEditFood={handleEditFood}
						/>
					))}
			</FoodsContainer>
		</>
	)
}
