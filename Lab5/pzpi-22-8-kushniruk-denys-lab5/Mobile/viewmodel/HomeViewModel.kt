package com.example.slcsystem.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.slcsystem.api.RetrofitClient
import com.example.slcsystem.api.Room
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeViewModel : ViewModel() {
    private val _roomsState = MutableStateFlow(RoomsState())
    val roomsState: StateFlow<RoomsState> = _roomsState.asStateFlow()

    fun loadRooms() {
        viewModelScope.launch {
            _roomsState.value = RoomsState(isLoading = true)
            try {
                val response = RetrofitClient.apiService.getRooms()
                if (response.isSuccessful && response.body() != null) {
                    _roomsState.value = RoomsState(rooms = response.body()!!)
                } else {
                    _roomsState.value = RoomsState(error = "Не вдалося завантажити кімнати")
                }
            } catch (e: Exception) {
                _roomsState.value = RoomsState(error = "Помилка мережі: ${e.message}")
            }
        }
    }
}

data class RoomsState(
    val rooms: List<Room> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)