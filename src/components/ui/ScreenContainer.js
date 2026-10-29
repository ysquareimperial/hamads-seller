import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './ScreenContainer.styles';

export function ScreenContainer({ children, scroll = true, edges }) {
    return (<SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>) : (<View style={[styles.flex, styles.content]}>{children}</View>)}
      </KeyboardAvoidingView>
    </SafeAreaView>);
}
