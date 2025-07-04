import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBlogDetail } from '../apis/blog';
import { formatText } from '../utils/blog';

export default function BlogDetail({ route }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation()
  const { blogId } = route.params
  const [blog, setBlog] = useState(null)
  // console.log(blog)

  const fetchBlogDetail = async () => {
    setIsLoading(true)
    const data = await getBlogDetail(blogId)
    console.log(data);
    if (!data.error) {
      if (data.result) {
        setBlog(data.result)
      } else setBlog(data.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBlogDetail()
  }, [blogId])

  return (
    <ScrollView style={styles.container}>
      {isLoading || !blog ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : (
        <>
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
            <Text style={styles.tagMain}>{blog?.tag?.name}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{blog?.title}</Text>

      {/* Meta info */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>👤 {blog?.expert?.fullName}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{blog?.createdAt}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>5 min read</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>👁 {blog?.viewCount} views</Text>
      </View>

          {/* Image */}
          <Image source={{ uri: blog?.sourceUrl }} style={styles.image} />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {formatText(blog?.content)}
            </Text>
          </View>
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
});