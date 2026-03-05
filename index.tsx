import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';

// Wi-Fi IP adresin buraya eklendi
const SUNUCU_URL = 'http://192.168.8.53:3000'; 

export default function App() {
  // Gelen verileri tutacağımız state
  const [veriler, setVeriler] = useState({ deger1: 0, deger2: 0, deger3: 0 });

  // Kullanıcının belirleyeceği eşik (threshold) değerleri
  const [esikler, setEsikler] = useState({ esik1: '80', esik2: '80', esik3: '80' });

  useEffect(() => {
    // Sunucuya bağlan
    const socket = io(SUNUCU_URL);

    // 'yeniVeri' kanalından gelen verileri dinle
    socket.on('yeniVeri', (gelenVeri) => {
      setVeriler(gelenVeri);

      // Eşik kontrolü yap
      let uyarilar = [];
      if (gelenVeri.deger1 >= Number(esikler.esik1)) uyarilar.push(`Veri 1 (${gelenVeri.deger1}), ${esikler.esik1} sınırını aştı!`);
      if (gelenVeri.deger2 >= Number(esikler.esik2)) uyarilar.push(`Veri 2 (${gelenVeri.deger2}), ${esikler.esik2} sınırını aştı!`);
      if (gelenVeri.deger3 >= Number(esikler.esik3)) uyarilar.push(`Veri 3 (${gelenVeri.deger3}), ${esikler.esik3} sınırını aştı!`);

      // Eğer uyarı varsa ekranda pop-up göster
      if (uyarilar.length > 0) {
        Alert.alert('EŞİK UYARISI ⚠️', uyarilar.join('\n'));
      }
    });

    // Component kapandığında bağlantıyı kes
    return () => socket.disconnect();
  }, [esikler]); // esikler değiştiğinde useEffect tekrar çalışıp yeni değerleri baz alır

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.baslik}>Canlı Sensör Verileri</Text>

      {/* Veri 1 */}
      <View style={styles.kart}>
        <Text style={styles.veriMetni}>Veri 1: {veriler.deger1}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={esikler.esik1}
          onChangeText={(text) => setEsikler({ ...esikler, esik1: text })}
          placeholder="Eşik 1"
        />
      </View>

      {/* Veri 2 */}
      <View style={styles.kart}>
        <Text style={styles.veriMetni}>Veri 2: {veriler.deger2}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={esikler.esik2}
          onChangeText={(text) => setEsikler({ ...esikler, esik2: text })}
          placeholder="Eşik 2"
        />
      </View>

      {/* Veri 3 */}
      <View style={styles.kart}>
        <Text style={styles.veriMetni}>Veri 3: {veriler.deger3}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={esikler.esik3}
          onChangeText={(text) => setEsikler({ ...esikler, esik3: text })}
          placeholder="Eşik 3"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  kart: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  veriMetni: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: 80,
    textAlign: 'center',
  },
});