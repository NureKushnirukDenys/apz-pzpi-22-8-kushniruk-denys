package com.example.slcsystem

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.slcsystem.api.auth.AuthManager
import com.example.slcsystem.ui.screens.HomeScreen
import com.example.slcsystem.ui.screens.RoomDetailScreen
import com.example.slcsystem.viewmodel.HomeViewModel

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val context = LocalContext.current

    NavHost(
        navController = navController,
        startDestination = if (AuthManager.getToken(context) != null) "home" else "login",
        modifier = modifier
    ) {
        composable("login") {
            LoginScreen(
                onLoginClick = { email, token ->
                    AuthManager.saveToken(context, token)
                    navController.navigate("home") {
                        popUpTo("login") { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate("register")
                }
            )
        }
        composable("register") {
            RegisterScreen(
                onRegisterClick = { name, email, token ->
                    AuthManager.saveToken(context, token)
                    navController.navigate("home") {
                        popUpTo("register") { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.navigate("login")
                }
            )
        }
        composable("home") {
            val viewModel: HomeViewModel = viewModel()
            HomeScreen(
                onLogoutClick = {
                    AuthManager.clearToken(context)
                    navController.navigate("login") {
                        popUpTo("home") { inclusive = true }
                    }
                },
                onRoomClick = { roomId ->
                    navController.navigate("room_detail/$roomId")
                },
                viewModel = viewModel
            )
        }
        composable(
            "room_detail/{roomId}",
            arguments = listOf(navArgument("roomId") { type = NavType.StringType })
        ) { backStackEntry ->
            val roomId = backStackEntry.arguments?.getString("roomId") ?: return@composable
            val homeViewModel: HomeViewModel = viewModel()
            RoomDetailScreen(
                roomId = roomId,
                onBackClick = {
                    homeViewModel.loadRooms() // Перезавантажуємо список кімнат
                    navController.popBackStack()
                }
            )
        }
    }
}