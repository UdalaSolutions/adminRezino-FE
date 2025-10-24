import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { Product } from '@/types/index';

const fetchProducts = async (): Promise<Product[]> => {
	const res = await axios.get(`${BASE_URL}/api/product/get-all-product`);
	return res.data?.data?.products || [];
};

export function useProducts() {
	return useQuery<Product[]>({
		queryKey: ['products'],
		queryFn: fetchProducts,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}
