package com.example.slcsystem.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.slcsystem.api.RetrofitClient
import com.example.slcsystem.api.Room
import com.example.slcsystem.api.UpdateRoomRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.example.slcsystem.api.UpdateRoomStatusRequest
import kotlin.math.roundToInt

@Composable
fun RoomDetailScreen(
    roomId: String,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: RoomDetailViewModel = viewModel()
) {
    val roomState by viewModel.roomState.collectAsState()

    LaunchedEffect(roomId) {
        viewModel.loadRoom(roomId)
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.background,
                        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )
                )
            )
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Деталі кімнати",
            fontSize = 24.sp,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        when {
            roomState.isLoading -> {
                CircularProgressIndicator(
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(48.dp)
                )
            }
            roomState.error != null -> {
                Text(
                    text = roomState.error!!,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(16.dp)
                )
                Button(
                    onClick = { viewModel.loadRoom(roomId) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .clip(RoundedCornerShape(12.dp))
                ) {
                    Text("Повторити", fontSize = 18.sp)
                }
            }
            roomState.room != null -> {
                RoomDetailCard(
                    room = roomState.room!!,
                    onStatusChange = { newStatus ->
                        viewModel.updateRoomStatus(roomId, newStatus)
                    },
                    onBrightnessChange = { newBrightness ->
                        viewModel.updateRoomBrightness(roomId, newBrightness)
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onBackClick() },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .clip(RoundedCornerShape(12.dp)),
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.primary
            )
        ) {
            Text(
                text = "Назад",
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.onPrimary
            )
        }
    }
}

@Composable
fun RoomDetailCard(
    room: Room,
    onStatusChange: (Boolean) -> Unit,
    onBrightnessChange: (Float) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(8.dp, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = room.name,
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 4.dp)
            ) {
                Text(
                    text = "Статус: ${if (room.status) "Увімкнено" else "Вимкнено"}",
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (room.status) Color(0xFF4CAF50) else Color(0xFFF44336),
                    modifier = Modifier.weight(1f)
                )
                Switch(
                    checked = room.status,
                    onCheckedChange = { onStatusChange(it) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = MaterialTheme.colorScheme.primary,
                        checkedTrackColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f),
                        uncheckedThumbColor = MaterialTheme.colorScheme.onSurface,
                        uncheckedTrackColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                )
            }
            Column(
                modifier = Modifier.padding(bottom = 4.dp)
            ) {
                Text(
                    text = "Яскравість: ${room.brightness.roundToInt()}%",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Slider(
                    value = room.brightness,
                    onValueChange = { onBrightnessChange(it) },
                    valueRange = 0f..100f,
                    steps = 99, // Для плавного руху (0–100)
                    modifier = Modifier.fillMaxWidth(),
                    colors = SliderDefaults.colors(
                        thumbColor = MaterialTheme.colorScheme.primary,
                        activeTrackColor = MaterialTheme.colorScheme.primary,
                        inactiveTrackColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                    )
                )
            }
            Text(
                text = "IoT Пристрій: ${room.iotDeviceId}",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Відстань: ${room.distance} см",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

class RoomDetailViewModel : ViewModel() {
    private val _roomState = MutableStateFlow(RoomState())
    val roomState: StateFlow<RoomState> = _roomState.asStateFlow()

    fun loadRoom(roomId: String) {
        viewModelScope.launch {
            _roomState.value = RoomState(isLoading = true)
            try {
                val response = RetrofitClient.apiService.getRoomById(roomId)
                if (response.isSuccessful && response.body() != null) {
                    _roomState.value = RoomState(room = response.body()!!)
                } else {
                    _roomState.value = RoomState(error = "Кімната не знайдена")
                }
            } catch (e: Exception) {
                _roomState.value = RoomState(error = "Помилка мережі: ${e.message}")
            }
        }
    }

    fun updateRoomStatus(roomId: String, status: Boolean) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.apiService.updateRoomStatus(
                    roomId,
                    UpdateRoomStatusRequest(status)
                )
                if (response.isSuccessful && response.body() != null) {
                    _roomState.value = _roomState.value.copy(
                        room = response.body()!!.room,
                        error = null
                    )
                } else {
                    _roomState.value = _roomState.value.copy(
                        error = "Не вдалося оновити статус"
                    )
                }
            } catch (e: Exception) {
                _roomState.value = _roomState.value.copy(
                    error = "Помилка мережі: ${e.message}"
                )
            }
        }
    }

    fun updateRoomBrightness(roomId: String, brightness: Float) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.apiService.updateRoom(
                    roomId,
                    UpdateRoomRequest(brightness = brightness)
                )
                if (response.isSuccessful && response.body() != null) {
                    _roomState.value = _roomState.value.copy(
                        room = response.body()!!.room,
                        error = null
                    )
                } else {
                    _roomState.value = _roomState.value.copy(
                        error = "Не вдалося оновити яскравість"
                    )
                }
            } catch (e: Exception) {
                _roomState.value = _roomState.value.copy(
                    error = "Помилка мережі: ${e.message}"
                )
            }
        }
    }
}

data class RoomState(
    val room: Room? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)