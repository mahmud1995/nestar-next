import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);

 

/*
Redux - malumotlarni saqlash, backenddan kelayotgan malumotlarni tugri interfaceda
	saqlanayotganini biz redux architecture orqali hosil qilganmiz 
	==> malumotlar tugri typelarda kelishini taminlash & data ni redux single storage da saqlash mechanism ni joriy

React Query - backend dan 100% aniq format data qabul qilish fazasi yaratilgan bulsagina.. 
	chunki react query backenddan olgan malumotni tekshirmasdan tugridan tugri cachega auto save qiladigan STATE MANAGEMENT TOOL hisoblanadi
	NESTAR - OK ==> backenddi monorepo Project - default serveri GraphQL API Backend server - DTO lar orqali 100% tugri backend serverni qurib olish hosil qb beradi


*/