import { useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BlogDetail({ route }) {
  const navigation = useNavigation();
  const { post } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Share</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Save</Text></TouchableOpacity>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <Text style={styles.tagMain}>{post.tag}</Text>
        {/* Add more tags if needed */}
      </View>

      {/* Title */}
      <Text style={styles.title}>{post.title}</Text>

      {/* Meta info */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>👤 Đầu Tư Chứng Khoán</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>24/06/2025</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>5 min read</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>👁 {post.views} views</Text>
      </View>

      {/* Image */}
      <Image source={{ uri: post.image }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          # Đầu Tư Tài Chính Cho Thế Hệ Tương Lai Việt Nam{'\n\n'}
          Trong bối cảnh kinh tế toàn cầu đang có những biến động mạnh mẽ, việc đầu tư tài chính thông minh đã trở thành một yếu tố quan trọng quyết định đến sự thành công của thế hệ trẻ Việt Nam.{'\n\n'}
          ## Tại Sao Đầu Tư Tài Chính Quan Trọng?{'\n\n'}
          Thế hệ trẻ Việt Nam hiện tại đang đối mặt với nhiều thách thức về tài chính:{'\n'}
          - **Lạm phát gia tăng**: Giá trị đồng tiền giảm dần theo thời gian{'\n'}
          - **Chi phí sinh hoạt tăng cao**: Nhà ở, giáo dục, y tế ngày càng đắt đỏ{'\n'}
          - **Hệ thống lương hưu không đảm bảo**: Cần có kế hoạch tài chính cá nhân{'\n\n'}
          ## Các Chiến Lược Đầu Tư Hiệu Quả{'\n\n'}
          {/* ...Thêm nội dung chi tiết ở đây... */}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  backBtn: { color: '#f43f5e', fontWeight: 'bold', fontSize: 16 },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { marginLeft: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: '#f3f4f6' },
  actionText: { color: '#f43f5e', fontWeight: 'bold' },
  tagsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8, gap: 8 },
  tagMain: { backgroundColor: '#fde68a', color: '#b45309', fontWeight: 'bold', fontSize: 13, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, marginRight: 6 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginHorizontal: 16, marginTop: 12, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginHorizontal: 16, marginBottom: 8 },
  metaText: { color: '#888', fontSize: 13 },
  metaDot: { color: '#bbb', marginHorizontal: 4 },
  image: { width: '92%', height: 180, borderRadius: 12, alignSelf: 'center', marginVertical: 12, backgroundColor: '#eee' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  contentText: { color: '#222', fontSize: 15, lineHeight: 22 },
});