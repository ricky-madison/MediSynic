
import React, { useState } from 'react';
import { MessageCircle, ArrowRight, Brain, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ProFeatureLock from '@/components/ProFeatureLock';
import { Separator } from '@/components/ui/separator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AISymptomChecker = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll try to provide some general information. Remember, I'm not a replacement for professional medical advice." }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProLimit, setShowProLimit] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    
    // Check if this would be the 3rd question (pro limit)
    if (newMessages.filter(m => m.role === 'user').length >= 3) {
      setTimeout(() => {
        setIsLoading(false);
        setShowProLimit(true);
      }, 1000);
      return;
    }
    
    // Simulate AI response
    setTimeout(() => {
      let response = "";
      const userInput = inputMessage.toLowerCase();
      
      if (userInput.includes("headache")) {
        response = "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For persistent or severe headaches, please consult a healthcare provider. In the meantime, rest, hydration, and over-the-counter pain relievers may help.";
      } else if (userInput.includes("fever") || userInput.includes("temperature")) {
        response = "A fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and use fever-reducing medications if necessary. If your fever is high (above 103°F/39.4°C), lasts more than a few days, or is accompanied by severe symptoms, seek medical attention.";
      } else if (userInput.includes("cough")) {
        response = "Coughs can be due to various causes including colds, allergies, or respiratory infections. Stay hydrated, use honey (if over 1 year old), and consider over-the-counter cough suppressants. If your cough persists more than a few weeks or is accompanied by difficulty breathing, see a doctor.";
      } else {
        response = "Thank you for sharing that information. While I can provide general health information, I'm not able to diagnose specific conditions. If you're experiencing concerning symptoms, I recommend consulting with a healthcare professional who can provide personalized medical advice.";
      }
      
      setMessages([...newMessages, { role: 'assistant' as const, content: response }]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const showProFeatureToast = () => {
    toast({
      title: "Pro Feature",
      description: "Unlimited AI health consultations are available only in the Pro plan.",
      variant: "default",
      duration: 3000,
    });
  };
  
  const resetChat = () => {
    setMessages([
      { role: 'assistant', content: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll try to provide some general information. Remember, I'm not a replacement for professional medical advice." }
    ]);
    setShowProLimit(false);
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            AI Symptom Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Get preliminary insights about your symptoms
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-2 border-blue-100 dark:border-blue-900/30 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Health Assistant
              </CardTitle>
              <CardDescription>
                Describe your symptoms for preliminary information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 p-1">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {!showProLimit ? (
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Describe your symptoms..." 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="resize-none"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="shrink-0"
                  >
                    Send
                  </Button>
                </div>
              ) : (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
                      <Lock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 dark:text-purple-300">
                        You've reached the free plan limit
                      </h4>
                      <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
                        Upgrade to Pro for unlimited AI health consultations and advanced symptom analysis.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          onClick={showProFeatureToast}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Upgrade to Pro
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetChat}
                          className="border-purple-200 text-purple-700"
                        >
                          Reset Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground border-t pt-3">
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>This is not a substitute for professional medical advice, diagnosis, or treatment.</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>Important notice about this service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm">This AI assistant provides general information only, not medical diagnosis or advice.</p>
              </div>
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm">Our AI uses general health knowledge to provide preliminary information about symptoms.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm">Always consult with a qualified healthcare professional for medical concerns.</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="rounded-lg border p-3 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-medium text-sm mb-2">Free Plan Includes:</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>3 AI health queries per session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Basic symptom information</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-lg border border-purple-200 p-3 bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  Pro Plan Features
                  <ProFeatureLock 
                    feature="Pro Health Assistant" 
                    variant="inline" 
                    size="sm"
                  />
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>Unlimited AI health queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>Detailed symptom analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>Save conversation history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>Medication interaction checks</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                  onClick={showProFeatureToast}
                >
                  Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISymptomChecker;
