import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import { OtpInput } from '@/components/ui/OtpInput';

import { styles } from './OtpStep.styles';

/**
 * Two-stage "enter target → enter code" UI driven by useOtpStep.
 * `renderTargetField(otp)` renders the phone/email input for stage one.
 */
export function OtpStep({ otp, renderTargetField, sendLabel = 'Send code', verifyLabel = 'Verify and continue' }) {
    if (otp.stage === 'enter') {
        return (<View style={styles.form}>
        {renderTargetField(otp)}
        <ErrorMessage message={otp.error}/>
        <Button title={sendLabel} onPress={otp.send} loading={otp.sending}/>
      </View>);
    }

    return (<View style={styles.form}>
      <View style={styles.sentRow}>
        <Text style={styles.sentText}>
          Code sent to <Text style={styles.sentTarget}>{otp.displayTarget}</Text>
        </Text>
        <Pressable accessibilityRole="button" onPress={otp.changeTarget} hitSlop={8}>
          <Text style={styles.link}>Change</Text>
        </Pressable>
      </View>
      {otp.devFilled ? <NoticeBanner message="Test mode: your code was filled in automatically."/> : null}
      <Text style={styles.label}>Verification code</Text>
      <OtpInput value={otp.code} onChange={otp.setCode} length={otp.length} hasError={!!otp.error} editable={!otp.verifying} autoFocus={!otp.devFilled}/>
      <ErrorMessage message={otp.error}/>
      <Button title={verifyLabel} onPress={otp.verify} loading={otp.verifying}/>
      <View style={styles.resendRow}>
        {otp.cooldown > 0 ? (<Text style={styles.muted}>{`Resend code in ${otp.cooldown}s`}</Text>) : (<Pressable accessibilityRole="button" onPress={otp.resend} disabled={otp.sending} hitSlop={8}>
            <Text style={styles.link}>{otp.sending ? 'Sending…' : 'Resend code'}</Text>
          </Pressable>)}
      </View>
    </View>);
}
