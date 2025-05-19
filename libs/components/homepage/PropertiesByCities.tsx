import React, { useCallback, useRef, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Link, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { PropertiesInquiry } from '../../types/property/property.input';
import { PropertyLocation } from '../../enums/property.enum';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface CityFilterProps {
	initialInput: PropertiesInquiry;
}

interface CityTotal {
	location: PropertyLocation;
	total: number;
}

const PropertiesByCities = (props: CityFilterProps) => {
	const { initialInput } = props;
	const locationRef: any = useRef();
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const [cityTotals, setCityTotals] = useState<CityTotal[]>([]); // Store per-city totals
	const router = useRouter();
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));

	/** APOLLO REQUESTS **/
	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperties) {
				// Assuming getProperties returns a list with location counts
				const totals = Object.values(PropertyLocation).map((location) => ({
					location,
					total: data.getProperties.list.filter((property: any) => property.propertyLocation === location).length,
				}));
				setCityTotals(totals);
			}
		},
		onError: (error) => {
			console.error('Error fetching properties:', error);
		},
	});

	/** HANDLERS **/
	console.log('searchFilter', searchFilter);

	const handleCardClick = useCallback(
		(location: PropertyLocation) => {
			const updatedSearchFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					locationList: [location],
				},
			};
			setSearchFilter(updatedSearchFilter);
			if (updatedSearchFilter?.search?.locationList) {
				router.push({
					pathname: '/property',
					query: { input: JSON.stringify(updatedSearchFilter) },
				});
			}
		},
		[searchFilter, router],
	);

	console.log('searchFilter', searchFilter);

	const device = useDeviceDetect();
	if (device === 'mobile') {
		return <span>Properties By Cities</span>;
	} else {
		return (
			<Stack className={'properties-bycities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Properties by Cities</span>
							<p>You can find properties by cities</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Grid container rowSpacing={0.1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						{propertyLocation.map((location: PropertyLocation, idx: any) => {
							const cityTotal = cityTotals.find((ct) => ct.location === location)?.total || 0;
							return (
								<Grid item xs={6} sm={4} md={2} key={idx}>
									<Card className={'card'} onClick={() => handleCardClick(location)}>
										<CardMedia
											component="img"
											height="140"
											image={`img/banner/cities/${location.toLowerCase()}.webp`}
											alt={location}
											className={'image'}
										/>
										<CardContent className={'cardContent'}>
											<Typography variant="subtitle1" fontWeight="bold">
												{location}
											</Typography>
											<Typography variant="body2">{cityTotal} properties</Typography>
										</CardContent>
									</Card>
								</Grid>
							);
						})}
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

PropertiesByCities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {
			squaresRange: { start: 0, end: 500 },
			pricesRange: { start: 0, end: 2000000 },
			locationList: [], // Initialize with empty locationList
		},
	},
};

export default PropertiesByCities;
